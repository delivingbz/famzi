ALTER TABLE "AdminUser" ADD COLUMN "emailVerifiedAt" TIMESTAMP(3);

CREATE TABLE "AdminEmailVerification" (
    "id" SERIAL NOT NULL,
    "adminUserId" INTEGER NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AdminEmailVerification_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AdminEmailVerification_tokenHash_key" ON "AdminEmailVerification"("tokenHash");
CREATE INDEX "AdminEmailVerification_adminUserId_idx" ON "AdminEmailVerification"("adminUserId");
CREATE INDEX "AdminEmailVerification_expiresAt_idx" ON "AdminEmailVerification"("expiresAt");

ALTER TABLE "AdminEmailVerification" ADD CONSTRAINT "AdminEmailVerification_adminUserId_fkey"
    FOREIGN KEY ("adminUserId") REFERENCES "AdminUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
