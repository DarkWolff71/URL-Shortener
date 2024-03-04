import { Injectable } from '@nestjs/common';
import * as zookeeper from 'node-zookeeper-client';

@Injectable()
export class ZookeeperService {
  private zkClient: zookeeper.Client;
  private range: { start: number; end: number; current: number };
  constructor() {
    this.zkClient = zookeeper.createClient('zookeeper-server');
    this.range = {
      start: 56800235584,
      end: 56800235584,
      current: 56800235584,
    };
    this.connectZK();
  }

  getRange() {
    return this.range;
  }

  setRange(range: { start: number; end: number; current: number }) {
    this.range = range;
  }

  async setTokenRange(token: number) {
    let dataToSet = Buffer.from(String(token), 'utf8');

    this.zkClient.setData('/token', dataToSet, (error) => {
      if (error) {
        console.log(error);
        return;
      }
    });
  }

  async getTokenRange() {
    this.zkClient.getData('/token', (error, data) => {
      if (error) {
        console.log(error);
        return;
      }

      this.range.start = parseInt(data.toString()) + 100000;
      this.range.current = parseInt(data.toString()) + 100000;
      this.range.end = parseInt(data.toString()) + 200000;

      this.setTokenRange(this.range.start);
    });
    return this.range;
  }

  async createToken() {
    let buffer = Buffer.from('0', 'utf8');

    this.zkClient.create(
      '/token',
      buffer,
      zookeeper.CreateMode.PERSISTENT,
      (error, path) => {
        if (error) {
          console.log(error);
          return;
        }
        console.log('Node: %s is created.', path);
      },
    );
  }

  async checkIfTokenExists() {
    this.zkClient.exists('/token', (error, stat) => {
      if (error) {
        console.log(error);
        return;
      }

      if (stat) {
        console.log('Node exists: %s', stat);
      } else {
        this.createToken();
      }
    });
  }

  async removeToken() {
    this.zkClient.remove('/token', (error) => {
      if (error) {
        console.log(error);
        return;
      }

      console.log('Node is deleted.');
    });
  }

  async connectZK() {
    this.zkClient.once('connected', async () => {
      console.log('Connected to the ZK server.');
      this.checkIfTokenExists();
      this.getTokenRange();
      console.log('hello', this.range.start);
    });

    this.zkClient.connect();
  }
}
