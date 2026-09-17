-- Preserve existing draft/published categories while restricting future values.
CREATE TYPE "BlogCategory" AS ENUM ('WEB', 'DATA', 'TUTORIALS', 'AUTOMATION', 'CUSTOMER_SUPPORT', 'IT_SUPPORT', 'CONTENT', 'DESIGN', 'TECH_TIPS');
ALTER TABLE "BlogPost" ALTER COLUMN "category" TYPE "BlogCategory" USING ("category"::"BlogCategory");
