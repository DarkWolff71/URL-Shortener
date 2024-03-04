# URL Shortening Service

This document provides an overview of the technology stack, system architecture, data capacity calculations, and key design decisions for our URL shortening service.

## Tech Stack

### Frontend

- **Framework:** React
- **Input Validation:** Zod
- **UI Libraries:** Aceternity UI, ShadCN UI, Tailwind CSS
- **State Management:** Recoil

### Backend

- **Framework:** Nest.js
- **Authentication:** Passport (Passport JWT with JWT tokens stored in cookies)
- **Collision Management:** Apache Zookeeper
- **Database:** MongoDB
- **ORM:** Prisma
- **Metric Collection:** Prometheus
- **Metric Visualization:** Grafana

## System Architecture

## Data Capacity Calculation

### Assumptions

- Read to Writes ratio: 50:1 [1 new URL is created for every 50 redirections to existing URLs]
- Long URL size: 2 KB
- Short URL size: 7 chars
- Created at size: 10 chars
- User credentials size (average per URL created): 4 chars
- Total size per URL record: 2.021 KB

### Storage Calculation

For 200 million URLs created per month, the required storage space is calculated as follows:

- Storage per URL: 2.021 KB
- Total URLs per month: 200 million
- Total storage per month: 404.2 GB
- Data replication factor: 5
- Total data storage per month with replication: 2.021 TB

## Design Decisions

### MongoDB

We chose MongoDB for our database because of the large amount of data and the need for distributed storage servers. MongoDB's built-in sharding and partitioning capabilities make it well-suited for handling high volumes of data and optimizing read speeds.

### URL Encoding Strategy

We use a Base62 encoding strategy for generating short URLs. This allows us to store 3.5 trillion unique URLs using just 7 characters, significantly optimizing our storage requirements.

### Apache Zookeeper for Collision Management

To prevent collisions in URL encoding across multiple servers, we use Apache Zookeeper. Each server registers with Zookeeper to obtain a unique range of numbers for URL encoding. This ensures that even if a server goes down, it can restart, re-register, and receive a new range without risking collisions.
