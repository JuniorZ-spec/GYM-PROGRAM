-- CreateTable
CREATE TABLE "user_profile" (
    "userId" TEXT NOT NULL,
    "goal" VARCHAR(50) NOT NULL,
    "currentWeight" DOUBLE PRECISION NOT NULL,
    "targetWeight" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" VARCHAR(20) NOT NULL,
    "level" VARCHAR(50) NOT NULL,
    "daysPerWeek" INTEGER NOT NULL,
    "location" VARCHAR(20) NOT NULL,
    "equipment" TEXT[],
    "injuries" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profile_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "training_plans" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planJson" JSONB NOT NULL,
    "planText" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "training_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weight_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "loggedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "weight_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "week" INTEGER NOT NULL,
    "day" VARCHAR(50) NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "session_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "training_plans_userId_idx" ON "training_plans"("userId");

-- CreateIndex
CREATE INDEX "weight_logs_userId_idx" ON "weight_logs"("userId");

-- CreateIndex
CREATE INDEX "session_logs_userId_idx" ON "session_logs"("userId");
