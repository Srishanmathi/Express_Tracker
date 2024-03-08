const express = require('express');
const mongoose=require('mongoose');
const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/expense-tracker');
const expenseSchema=new mongoose.Schema({
  description:String,
  amount:Number
});

const Expense=mongoose.model('Expense',expenseSchema);

app.use(express.json());
app.use(express.static('public'));

let expenses = [];

app.get('/api/expenses', async(req, res) => {
  const expenses=await Expense.find();//in mongo db it will provide all the data because we did not give parameters 
  res.json(expenses);
});

app.post('/api/expenses',  async (req, res) => {
  const newExpense =new Expense(req.body);//des and amt in json format
  await newExpense.save();//wait until the data comes 
  expenses.push(newExpense);
  res.status(201).json(newExpense);
});

app.put('/api/expenses/:id',async(req,res)=>{
  const{id}=req.params;
  const updateExpenses=await Expense.findByIdAndUpdate(id,req.body,{new:true});
  res.json(updateExpenses);
});

app.delete('/api/expenses/:id',async(req,res)=>{
  const{id}=req.params;
  await Expense.findByIdAndDelete(id);
  res.sendStatus(204);
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
