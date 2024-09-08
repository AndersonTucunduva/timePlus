-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Adjustment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" INTEGER NOT NULL,
    "description" TEXT,
    "userId" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "Adjustment_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Adjustment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Adjustment" ("amount", "date", "description", "employeeId", "id", "userId") SELECT "amount", "date", "description", "employeeId", "id", coalesce("userId", 1) AS "userId" FROM "Adjustment";
DROP TABLE "Adjustment";
ALTER TABLE "new_Adjustment" RENAME TO "Adjustment";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
