# Restaurant Intelligence Platform: Receipt-to-Insights Engine

## Current State
- **Status**: Initial setup phase
- **Repository**: Local development environment initialized
- **Core Documentation**: AI coding instructions, templates, and automation setup configured
- **Next Phase**: Database setup and core architecture implementation

## Architecture
### Planned Full-Stack Architecture
- **Frontend**: Next.js 14+ with TypeScript, TailwindCSS, Chart.js/D3.js for analytics visualizations
- **Backend**: Node.js/Express with TypeScript, JWT authentication, RESTful APIs
- **Database**: PostgreSQL for structured data (transactions, users, restaurants), MongoDB for analytics aggregation
- **AI/ML**: Python integration for machine learning models (demand forecasting, pricing optimization)
- **Real-time**: WebSocket connections for live dashboard updates
- **External APIs**: 
  - POS Systems: Square (MVP), Toast, Revel, Micros/Oracle
  - Weather API for demand correlation analysis
  - Event calendars for impact analysis

### Core Modules
1. **Sales Intelligence**: Revenue tracking, peak hour analysis, item performance
2. **Customer Analytics**: Behavior patterns, lifetime value, segmentation
3. **Menu Engineering**: Profit optimization, pricing recommendations, cross-selling
4. **Operations**: Staff optimization, inventory management, waste reduction
5. **Predictive**: Demand forecasting, financial projections, market analysis

## Technologies Used
- **Frontend**: Next.js, React, TypeScript, TailwindCSS, Chart.js
- **Backend**: Node.js, Express, TypeScript, JWT, bcrypt
- **Database**: PostgreSQL, MongoDB
- **ORM**: Prisma for PostgreSQL, Mongoose for MongoDB
- **Testing**: Jest, Cypress for E2E
- **Deployment**: Docker, AWS/GCP, CI/CD pipeline
- **Real-time**: Socket.io
- **AI/ML**: Python, scikit-learn, pandas, OpenAI API

## Current Deployment
- **Status**: Not yet deployed
- **Target Environment**: AWS/GCP with staging and production environments
- **Domain**: TBD - will need domain for production deployment
- **Database**: Will connect to real PostgreSQL and MongoDB instances

## Next Steps (Immediate Priorities)
1. **URGENT**: Setup real PostgreSQL database connection with proper schema
2. **HIGH**: Create Next.js project structure with authentication flow
3. **HIGH**: Build core API endpoints for restaurant and transaction data
4. **HIGH**: Integrate Square POS API with real credentials for MVP
5. **MEDIUM**: Implement basic sales analytics dashboard
6. **MEDIUM**: Setup staging deployment pipeline

## Real Data Requirements
- PostgreSQL database for production use
- MongoDB instance for analytics data
- Square API credentials (sandbox initially, then production)
- OAuth provider setup (Google/Auth0) for restaurant owner authentication
- Weather API key for correlation analysis
- Deployment environment (AWS/GCP account with proper permissions)

## Business Context
- **Target Market**: Small-Medium restaurants (5-50 locations)
- **Pricing Model**: $99-499/month per location
- **Value Proposition**: 5-15% profit increase through waste reduction and sales optimization
- **Core Features**: Real-time analytics, predictive insights, operational optimization