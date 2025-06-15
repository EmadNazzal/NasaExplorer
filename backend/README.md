# NASA Explorer Backend

## Setup

```bash
cd backend
npm install
cp .env.example .env
# Add your NASA_API_KEY in .env
npm run dev
```

## API Routes

- `/api/nasa/apod`
- `/api/nasa/mars-rover?sol=1000`
- `/api/nasa/epic`
- `/api/nasa/neo?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD`
- `/api/nasa/search?q=moon`
