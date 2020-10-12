const express = require("express");
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.use('/tasks',(req,res,next)=>{
  handleTasks(req,res,next)
})

app.listen(PORT, () => {
  console.log("Server running on port" + PORT);
});
