import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();

// ============ MIDDLEWARE ============
app.use(cors());
app.use(express.json());

// ============ MONGODB CONNECTION ============
mongoose.connect('mongodb+srv://preetychaurasiya811_db_user:test12345@cluster0.wxmfnal.mongodb.net/')
  .then(() => console.log('💾 MongoDB connected'))
  .catch(err => console.log('MongoDB error:', err));


// ====================== USER MODEL ======================
const UserSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = mongoose.model('users', UserSchema);


// ====================== EMPLOYEE MODEL ======================
const EmployeeSchema = new mongoose.Schema({
  employeeId: { type: String, unique: true },
  name: String,
  contact: String,
  email: String,
  parentDept: String,
  childDept: String,
  password: String,
  gender: String,
  role: String
});

const Employee = mongoose.model('employees', EmployeeSchema);

const ProjectSchema = new mongoose.Schema({
  projectId: { type: String, unique: true },
  projectName: String,
  clientName: String,
  startDate: String,
  leadBy: String // Employee _id or name
});

const Project = mongoose.model('projects', ProjectSchema);

const ProjectEmployeeSchema = new mongoose.Schema({
  empProjectId: { type: String, required: true, unique: true },
  projectId: { type: String, required: true },
  employeeId: { type: String, required: true },
  assignedDate: { type: String, required: true },
  role: { type: String, required: true }
});

const ProjectEmployee = mongoose.model('projectEmployees', ProjectEmployeeSchema);



// ====================== REGISTER ROUTE ======================
app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    const newUser = new User({ email, password });
    await newUser.save();

    return res.json({
      success: true,
      message: "Registration successful"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});


// ====================== LOGIN ROUTE ======================
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: "User not found" });

    if (user.password !== password)
      return res.status(401).json({ success: false, message: "Incorrect password" });

    return res.json({ success: true, email: user.email });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
});



async function generateEmployeeId() {
  const lastEmp = await Employee.findOne().sort({ _id: -1 });

  if (!lastEmp || !lastEmp.employeeId) {
    return "EMP1001";
  }

  let lastNum = parseInt(lastEmp.employeeId.replace("EMP", ""));
  let newId = "EMP" + (lastNum + 1);

  return newId;
}


async function generateEmpProjectId() {
  const lastRecord = await ProjectEmployee.findOne().sort({ empProjectId: -1 });

  if (!lastRecord || !lastRecord.empProjectId) {
    return "EMPPROJECT1001"; 
  }

  let lastNum = parseInt(lastRecord.empProjectId.replace("EMPPROJECT", ""));
  return "EMPPROJECT" + (lastNum + 1);
}



// ====================== ADD EMPLOYEE ======================
app.post("/api/employee", async (req, res) => {
  try {
    const employeeId = await generateEmployeeId(); // 👈 generate new ID

    const newEmployee = new Employee({
      employeeId,      
      ...req.body
    });

    const savedEmp = await newEmployee.save();
    res.json(savedEmp);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving employee" });
  }
});


// ====================== GET EMPLOYEES ======================
app.get('/api/employee', async (req, res) => {
  try {
    const employees = await Employee.find({});
    return res.json(employees);

  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ====================== DELETE EMPLOYEE ======================
app.delete('/api/employee/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedEmp = await Employee.findByIdAndDelete(id);

    if (!deletedEmp) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    return res.json({ success: true, message: 'Employee deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ====================== ADD PROJECT ======================
app.post("/api/project", async (req, res) => {
  try {
    // Generate Project ID => PRO + timestamp
    const newId = "PRO" + Date.now().toString().slice(-4);

    const project = new Project({
      projectId: newId,
      projectName: req.body.projectName,
      clientName: req.body.clientName,
      startDate: req.body.startDate,
     leadBy: req.body.leadBy
    });

    await project.save();

    res.json({ success: true, message: "Project Added!", projectId: newId });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});


// ====================== GET PROJECTS ======================
app.get('/api/project', async (req, res) => {
  try {
    const projects = await Project.find({});
    return res.json(projects);
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ====================== DELETE PROJECT ======================
app.delete('/api/project/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Project.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Project not found' });
    return res.json({ success: true, message: 'Project deleted!' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ====================== UPDATE PROJECT ======================
app.put('/api/project/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Project.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Project not found' });
    return res.json({ success: true, message: 'Project updated!', project: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});


app.get('/api/projectEmployee', async (req, res) => {
  try {
    const data = await ProjectEmployee.find({});
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ====================== ADD ======================
app.post('/api/projectEmployee', async (req, res) => {
  try {
    const empProjectId = await generateEmpProjectId();   // AUTO GENERATED ID

    const { projectId, employeeId, assignedDate, role } = req.body;

    if (!projectId || !employeeId || !assignedDate || !role) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const newRecord = new ProjectEmployee({
      empProjectId,
      projectId,
      employeeId,
      assignedDate,
      role
    });

    await newRecord.save();

    res.json({ 
      success: true, 
      message: 'Project Employee Added!', 
      empProjectId 
    });

  } catch (err) {
    console.error('Error saving ProjectEmployee:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});



// ====================== UPDATE ======================
app.put('/api/projectEmployee/:id', async (req, res) => {
  try {
    const updated = await ProjectEmployee.findOneAndUpdate(
      { empProjectId: req.params.id },
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ success: false, message: 'Record not found' });

    res.json({ success: true, message: 'Updated successfully', projectEmployee: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


// ====================== DELETE ======================
app.delete('/api/projectEmployee/:id', async (req, res) => {
  try {
    const deleted = await ProjectEmployee.findOneAndDelete({ empProjectId: req.params.id });

    if (!deleted) return res.status(404).json({ success: false, message: 'Record not found' });

    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});



app.get('/api/dashboard/counts', async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const totalProjects = await Project.countDocuments();
    const activeEmployees = await ProjectEmployee.countDocuments();

    res.json({ totalEmployees, totalProjects, activeEmployees });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});




// ====================== START SERVER ======================
app.listen(3000, () => {
  console.log('🚀 Server running at http://localhost:3000');
});
