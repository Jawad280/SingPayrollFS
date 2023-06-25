-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isAdmin" BOOLEAN,
    "license" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "NRIC" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "nationality" TEXT NOT NULL,
    "basicPay" TEXT NOT NULL,
    "allowance" TEXT NOT NULL,
    "additionalPay" TEXT NOT NULL,
    "otPay" TEXT NOT NULL,
    "otHours" TEXT NOT NULL,
    "modeOfPayment" TEXT NOT NULL,
    "citizenshipStatus" TEXT,
    "typeOfContributionRate" TEXT,
    "isResigned" BOOLEAN,
    "joinDate" TIMESTAMP(3),
    "resignDate" TIMESTAMP(3),
    "designation" TEXT,
    "companyName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payslip" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "employeeRef" TEXT NOT NULL,
    "companyName" TEXT,
    "contributionMonthYear" TIMESTAMP(3) NOT NULL,
    "dateOfPayment" TIMESTAMP(3) NOT NULL,
    "employeeName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "citizenshipStatus" TEXT,
    "NRIC" TEXT NOT NULL,
    "basicPay" TEXT NOT NULL,
    "allowance" TEXT NOT NULL,
    "additionalPay" TEXT NOT NULL,
    "otPay" TEXT NOT NULL,
    "otHours" TEXT NOT NULL,
    "modeOfPayment" TEXT NOT NULL,
    "isResigned" BOOLEAN,
    "employeeShare" TEXT,
    "employerShare" TEXT,
    "designation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payslip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Year" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Year_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_companyName_key" ON "User"("companyName");
