"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log("🌱 Seeding database...");
    // Create a company
    const company = await prisma.company.create({
        data: {
            name: "Acme Corporation",
        },
    });
    console.log(`✅ Created company: ${company.name}`);
    // Create users
    const adminUser = await prisma.user.create({
        data: {
            email: "admin@acme.com",
            password: await bcrypt.hash("admin123", 10),
            firstName: "Admin",
            lastName: "User",
            role: "admin",
            companyId: company.id,
        },
    });
    const analystUser = await prisma.user.create({
        data: {
            email: "analyst@acme.com",
            password: await bcrypt.hash("analyst123", 10),
            firstName: "Data",
            lastName: "Analyst",
            role: "analyst",
            companyId: company.id,
        },
    });
    console.log(`✅ Created users: ${adminUser.email}, ${analystUser.email}`);
    // Create sample dataset
    const csvData = `name,age,salary,department
Alice Johnson,28,75000,Engineering
Bob Smith,35,82000,Sales
Carol White,42,95000,Management
David Brown,31,68000,Engineering
Eve Davis,29,71000,Sales`;
    const dataset = await prisma.dataset.create({
        data: {
            name: "Employee Data Q1 2024",
            fileName: "employees.csv",
            fileSize: csvData.length,
            rowCount: 5,
            columns: JSON.stringify(["name", "age", "salary", "department"]),
            data: csvData,
            companyId: company.id,
        },
    });
    console.log(`✅ Created sample dataset: ${dataset.name}`);
    // Create sample analysis result
    const analysis = await prisma.analysisResult.create({
        data: {
            title: "Employee Salary Analysis",
            description: "Initial analysis of employee salary distribution",
            datasetId: dataset.id,
            summary: "Average salary is $78,200. Engineering has the highest average salary at $71,500.",
            insights: JSON.stringify([
                {
                    type: "salary_trend",
                    description: "Management roles have 20% higher salary than average",
                },
                {
                    type: "department_insight",
                    description: "Sales department has growing headcount",
                },
            ]),
            anomalies: JSON.stringify([
                {
                    type: "outlier",
                    description: "Carol White's salary is significantly above average",
                },
            ]),
        },
    });
    console.log(`✅ Created sample analysis: ${analysis.title}`);
    console.log("🎉 Seed complete!");
}
main()
    .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
