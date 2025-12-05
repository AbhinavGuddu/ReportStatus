import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017/reports-dashboard';

const dcCategories = [
  {
    name: 'Personal & Employment',
    environment: 'dc',
    order: 1,
    reports: [
      'Accumulator',
      'Allowd/Taken',
      'Deductions in Arrears',
      'Direct Deposit Information',
      'Emergency Contact',
      'Employee Census',
      'Employee Information',
      'Employee Payroll Changes',
      'Employee Profile',
      'Employee Roster',
      'Employee Salary History',
      'Employee Summary',
      'Incentive Pay Detail',
      'Name and Address Labels',
      'Recent Salary Change',
      'Reports to Details',
      'Reserved File Number',
      'Roth Catch- Up Eligibility',
      'Tenure',
      'Termination',
      'Turnover',
      'Voluntary Deduction',
      'Workers Compensation Employee Detail'
    ]
  },
  {
    name: 'Paydata',
    environment: 'dc',
    order: 2,
    reports: [
      'Active Hourly/Daily Employees Without Hours or Earnings',
      'Add,Adjust, or Estimate - Details',
      'Add,Adjust, or Estimate - Summary',
      'Automatic Pay Cancellation',
      'Employees Enabled for Automatic Pay',
      'Inactive Employees with Paydata',
      'Paydata - Details',
      'Paydata - Summary',
      'Paydata by Temporary Department/Cost Number',
      'Paydata Coded Hours and Earnings',
      'Salaried Employees With Hours',
      'Salaried Employees With Hours(ADPR)',
      'Third Party Sick Pay - Full',
      'Third Party Sick Pay Summary'
    ]
  },
  {
    name: 'Pay Statement History',
    environment: 'dc',
    order: 3,
    reports: [
      'Bank Reconciliation',
      'Employee Pay Statement and Labor Distribution Summary',
      'Pay Statement and Labor Distribution Deductions',
      'Pay Statement and Labor Distribution Earnings',
      'Pay Statement and Labor Distribution Hours',
      'Pay Statement and Labor Distribution Summary',
      'Payroll History'
    ]
  },
  {
    name: 'Wage Garnishment',
    environment: 'dc',
    order: 4,
    reports: [
      'Employee Lien Detail',
      'Employee Termination Letter'
    ]
  },
  {
    name: 'On - Site Printing',
    environment: 'dc',
    order: 5,
    reports: [
      'On - Site Printing Status'
    ]
  },
  {
    name: 'Talent Profile',
    environment: 'dc',
    order: 6,
    reports: [
      'Talent Profile'
    ]
  },
  {
    name: 'Recruitment',
    environment: 'dc',
    order: 7,
    reports: [
      'Section 503/VEVRAA Applicant Worksheet'
    ]
  },
  {
    name: 'Statutory Compliance',
    environment: 'dc',
    order: 8,
    reports: [
      'California Pay Data',
      'EEO-1',
      'Illinois Pay Data',
      'OSHA\'S Form 300',
      'OSHA\'S Form 300A',
      'OSHA\'S Form 301',
      'Vets-4212',
      'Vets-4212 Employee Detail'
    ]
  },
  {
    name: 'Time & Attendance',
    environment: 'dc',
    order: 9,
    reports: []
  },
  {
    name: 'Time Off',
    environment: 'dc',
    order: 10,
    reports: [
      'Time Off Balance Detail',
      'Time Off Balance Summary',
      'Time Off Policy Assignment',
      'Time Off Request'
    ]
  },
  {
    name: 'Benefits',
    environment: 'dc',
    order: 11,
    reports: [
      'Benefits and Confirmation Statement',
      'Benefits Deduction Validation',
      'Benefits Plan Summary',
      'Employee and Dependent/Beneficiary Enrollments',
      'Employee Enrollments',
      'Employee Enrollments Comparison',
      'Enrollment Activity',
      'Enrollment Event Activity',
      'W2 Detail'
    ]
  },
  {
    name: 'Benefits Invoices',
    environment: 'dc',
    order: 12,
    reports: [
      'Invoice Adjustments',
      'Invoice Changes',
      'Invoice Details',
      'Invoice Summary'
    ]
  },
  {
    name: 'Setup',
    environment: 'dc',
    order: 13,
    reports: [
      'Validation Tables'
    ]
  },
  {
    name: 'Audit Trail',
    environment: 'dc',
    order: 14,
    reports: [
      'Audit Trail',
      'EI-9 Audit'
    ]
  },
  {
    name: 'ACA',
    environment: 'dc',
    order: 15,
    reports: [
      'Aca Affordability Worksheet',
      'ACA Benefit Offering Audit',
      'ACA Benefit Status Worksheet',
      'ACA Comparison Worksheet Contributions vs. Affordability',
      'ACA Full - Time Equivalent Employee Count',
      'Patient Centered Outcomes Research Fees'
    ]
  }
];

async function updateDCReports() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('reports-dashboard');
    const categoriesCollection = db.collection('categories');
    const reportsCollection = db.collection('reports');
    
    console.log('Connected to MongoDB');
    
    // Delete existing DC categories and reports
    await categoriesCollection.deleteMany({ environment: 'dc' });
    await reportsCollection.deleteMany({ environment: 'dc' });
    console.log('Deleted existing DC data');
    
    // Insert new categories and reports
    for (const categoryData of dcCategories) {
      const { reports, ...categoryInfo } = categoryData;
      
      // Insert category
      const categoryResult = await categoriesCollection.insertOne(categoryInfo);
      const categoryId = categoryResult.insertedId;
      
      console.log(`Created category: ${categoryInfo.name}`);
      
      // Insert reports for this category
      if (reports.length > 0) {
        const reportsToInsert = reports.map((reportName, index) => ({
          name: reportName,
          category: categoryId,
          environment: 'dc',
          status: 'not-started',
          order: index + 1
        }));
        
        await reportsCollection.insertMany(reportsToInsert);
        console.log(`Created ${reports.length} reports for ${categoryInfo.name}`);
      }
    }
    
    console.log('DC reports update completed successfully!');
    
  } catch (error) {
    console.error('Error updating DC reports:', error);
  } finally {
    await client.close();
  }
}

updateDCReports();