# School Management System

This is a full-stack web application for managing and displaying school information, built with [Next.js](https://nextjs.org), React, and MySQL.

## Features

- Add new schools with details (name, address, city, state, contact, email, image)
- View a directory of all schools
- Delete schools from the directory
- Upload and display school images
- Responsive, modern UI with Tailwind CSS

## Tech Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS
- **Backend:** Next.js API routes
- **Database:** MySQL
- **ORM/DB:** mysql2 (direct SQL queries)

## Database Schema

```
CREATE TABLE schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  contact VARCHAR(15) NOT NULL,
  image TEXT,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Getting Started

1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up your `.env` file** with your MySQL credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_NAME=school_management
   ```
4. **Create the database and table** using the schema above.
5. **Run the development server:**
   ```bash
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `app/` — Next.js app directory (pages, API routes)
- `components/` — React components (forms, navigation, cards)
- `lib/db.js` — MySQL connection pool
- `public/` — Static files and uploaded images
- `database.sql` — Database schema

## Main Screens

- **Home:** Project overview
- **Add School:** Form to add a new school
- **View Schools:** List and manage all schools

## API Endpoints

- `POST /api/schools` — Add a new school
- `GET /api/schools` — List schools (with pagination)
- `DELETE /api/schools?id=ID` — Delete a school
- `POST /api/upload` — Upload school image

## License

MIT

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
