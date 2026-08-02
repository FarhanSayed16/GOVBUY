import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './src/models/user.model.js';
import { Tender } from './src/models/tender.model.js';
import { Document } from './src/models/document.model.js';
import { Bid } from './src/models/bid.model.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const seedData = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB for seeding...");

        // Clear existing data
        console.log("Clearing existing data...");
        await User.deleteMany({});
        await Tender.deleteMany({});
        await Document.deleteMany({});
        await Bid.deleteMany({});

        console.log("Seeding Users...");
        const usersToCreate = [
            {
                name: "Super Admin",
                email: "admin@govbuy.in",
                password: "password123",
                role: "admin",
                phone: "9876543210",
                status: "approved"
            },
            {
                name: "Ministry of Road Transport",
                email: "roads@govbuy.in",
                password: "password123",
                role: "government",
                phone: "9876543211",
                status: "approved"
            },
            {
                name: "Ministry of Health",
                email: "health@govbuy.in",
                password: "password123",
                role: "government",
                phone: "9876543212",
                status: "approved"
            },
            {
                name: "Department of IT",
                email: "it@govbuy.in",
                password: "password123",
                role: "government",
                phone: "9876543213",
                status: "approved"
            },
            {
                name: "BuildCo Construction Ltd",
                email: "bids@buildco.com",
                password: "password123",
                role: "supplier",
                phone: "9876543221",
                status: "approved"
            },
            {
                name: "TechCorp Solutions",
                email: "sales@techcorp.com",
                password: "password123",
                role: "supplier",
                phone: "9876543222",
                status: "approved"
            },
            {
                name: "MediEquip Suppliers",
                email: "contact@mediequip.com",
                password: "password123",
                role: "supplier",
                phone: "9876543223",
                status: "approved"
            }
        ];

        const createdUsers = [];
        for (const userData of usersToCreate) {
            const user = new User(userData);
            await user.save();
            createdUsers.push(user);
        }
        console.log(`Created ${createdUsers.length} users.`);

        const govRoads = createdUsers.find(u => u.email === "roads@govbuy.in");
        const govHealth = createdUsers.find(u => u.email === "health@govbuy.in");
        const govIT = createdUsers.find(u => u.email === "it@govbuy.in");
        const supplierBuildCo = createdUsers.find(u => u.email === "bids@buildco.com");
        const supplierTechCorp = createdUsers.find(u => u.email === "sales@techcorp.com");
        const supplierMediEquip = createdUsers.find(u => u.email === "contact@mediequip.com");

        console.log("Seeding Documents...");
        const createDummyDoc = async (user, filename) => {
            const doc = await Document.create({
                user: user._id,
                filename: filename,
                url: "https://res.cloudinary.com/demo/image/upload/sample.pdf",
                publicId: "sample_pdf_" + Date.now(),
                mimeType: "application/pdf",
                size: 102400
            });
            return doc;
        };

        const doc1 = await createDummyDoc(govRoads, "Tender_Specs_Highway.pdf");
        const doc2 = await createDummyDoc(govHealth, "Medical_Requirements_2026.pdf");
        const doc3 = await createDummyDoc(govIT, "DataCenter_Architecture.pdf");
        const doc4 = await createDummyDoc(govRoads, "Bridge_Blueprints.pdf");
        const doc5 = await createDummyDoc(govHealth, "Vaccine_Storage_Guidelines.pdf");
        const doc6 = await createDummyDoc(govIT, "School_IT_Hardware_List.pdf");

        console.log("Seeding Tenders...");
        const oneMonthFromNow = new Date();
        oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
        
        const twoMonthsFromNow = new Date();
        twoMonthsFromNow.setMonth(twoMonthsFromNow.getMonth() + 2);

        const pastDate = new Date();
        pastDate.setMonth(pastDate.getMonth() - 1);

        const tendersToCreate = [
            {
                title: "National Highway Construction Phase II",
                description: "Construction of a 4-lane national highway spanning 150 km, including 3 major bridges and 12 underpasses.",
                category: "construction",
                budget: 5000000000, // 5 Billion
                deadline: oneMonthFromNow,
                status: "open",
                createdBy: govRoads._id,
                city: "Mumbai",
                attachments: [doc1._id]
            },
            {
                title: "River Bridge Reinforcement Project",
                description: "Structural reinforcement and modern lighting installation for the historic River Bridge.",
                category: "construction",
                budget: 250000000,
                deadline: twoMonthsFromNow,
                status: "open",
                createdBy: govRoads._id,
                city: "Delhi",
                attachments: [doc4._id]
            },
            {
                title: "Supply of MRI and CT Scan Machines",
                description: "Procurement of 10 MRI and 20 CT scan machines for various district hospitals.",
                category: "healthcare",
                budget: 1500000000,
                deadline: oneMonthFromNow,
                status: "open",
                createdBy: govHealth._id,
                city: "Bangalore",
                attachments: [doc2._id]
            },
            {
                title: "Cold Chain Storage for Vaccines",
                description: "Setup of 50 advanced cold chain storage facilities across rural healthcare centers.",
                category: "healthcare",
                budget: 450000000,
                deadline: pastDate,
                status: "closed",
                createdBy: govHealth._id,
                city: "Pune",
                attachments: [doc5._id]
            },
            {
                title: "National Data Center Infrastructure Upgrade",
                description: "Modernization of the central government data center with new high-density server racks, cooling, and security systems.",
                category: "it infrastructure",
                budget: 800000000,
                deadline: twoMonthsFromNow,
                status: "open",
                createdBy: govIT._id,
                city: "Hyderabad",
                attachments: [doc3._id]
            },
            {
                title: "Smart Classroom IT Setup for Public Schools",
                description: "Delivery and installation of smart boards, projectors, and local servers for 1000 public schools.",
                category: "education",
                budget: 1200000000,
                deadline: oneMonthFromNow,
                status: "open",
                createdBy: govIT._id,
                city: "Chennai",
                attachments: [doc6._id]
            }
        ];

        const createdTenders = await Tender.insertMany(tendersToCreate);
        console.log(`Created ${createdTenders.length} tenders.`);

        console.log("Seeding Bids...");
        const bidDoc1 = await createDummyDoc(supplierBuildCo, "BuildCo_Proposal_Highway.pdf");
        const bidDoc2 = await createDummyDoc(supplierBuildCo, "BuildCo_Bridge_Quote.pdf");
        const bidDoc3 = await createDummyDoc(supplierTechCorp, "TechCorp_DataCenter_Architecture.pdf");
        const bidDoc4 = await createDummyDoc(supplierTechCorp, "TechCorp_SmartClass_Bid.pdf");
        const bidDoc5 = await createDummyDoc(supplierMediEquip, "MediEquip_Scanner_Specs.pdf");
        const bidDoc6 = await createDummyDoc(supplierMediEquip, "MediEquip_ColdStorage.pdf");

        const bidsToCreate = [
            {
                tender: createdTenders[0]._id, // Highway
                supplier: supplierBuildCo._id,
                bidAmount: 4800000000,
                proposal: "We propose a cost-effective 4-lane model completing in 24 months.",
                proposalDoc: bidDoc1._id,
                status: "pending"
            },
            {
                tender: createdTenders[1]._id, // Bridge
                supplier: supplierBuildCo._id,
                bidAmount: 245000000,
                proposal: "Our structural reinforcement uses advanced carbon fiber wrapping.",
                proposalDoc: bidDoc2._id,
                status: "pending"
            },
            {
                tender: createdTenders[2]._id, // Medical Machines
                supplier: supplierMediEquip._id,
                bidAmount: 1450000000,
                proposal: "Providing state-of-the-art European manufactured scanning machines with 5-year AMC.",
                proposalDoc: bidDoc5._id,
                status: "pending"
            },
            {
                tender: createdTenders[3]._id, // Cold Storage (closed)
                supplier: supplierMediEquip._id,
                bidAmount: 440000000,
                proposal: "Solar-powered cold chain units for remote areas.",
                proposalDoc: bidDoc6._id,
                status: "accepted"
            },
            {
                tender: createdTenders[4]._id, // Data Center
                supplier: supplierTechCorp._id,
                bidAmount: 790000000,
                proposal: "High-density compute infrastructure with redundant liquid cooling.",
                proposalDoc: bidDoc3._id,
                status: "pending"
            },
            {
                tender: createdTenders[5]._id, // Smart Class
                supplier: supplierTechCorp._id,
                bidAmount: 1150000000,
                proposal: "Turnkey smart classroom solution with offline content servers.",
                proposalDoc: bidDoc4._id,
                status: "pending"
            }
        ];

        const createdBids = await Bid.insertMany(bidsToCreate);
        console.log(`Created ${createdBids.length} bids.`);

        console.log("Database seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
};

seedData();
