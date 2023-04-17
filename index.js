import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";

const app = express();
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect('mongodb://0.0.0.0:27017/wscube',{         
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>console.log('Database connection done'))
.catch((err)=>console.log(err));



const bookSchema = new mongoose.Schema({
    book_name: String,
    author_name: String,
    year_published: Number,
    price: Number,
    discount: Number,
    no_of_pages: Number,
    condition: String,
})

const Library = new mongoose.model("Library",bookSchema);    


app.get('/',(req,res)=>{
    res.send('My book registration');
})

//POST API 
app.post("/register/book",async(req,res)=>{
    console.log(req.body);
       const book_name = req.body.book_name;
       const author_name = req.body.author_name;
       const year_published = req.body.year_published;
       const price = req.body.price;
       const discount = req.body.discount;
       const no_of_pages = req.body.no_of_pages;
       const condition = req.body.condition;
   
    
        
        
            const library = new Library({
                book_name,
                author_name,
                year_published,
                price,
                discount,
                no_of_pages,
                condition
            })
            await library.save()
                .then(result=>{
                    res.status(200).json({new_book : result});
                })
                .catch(err=>{
                    console.log(err)
                    res.status(500).json({error : err});
                })
        })
 
        //UPDATE API
        app.put("/update/book/:id",async(req,res)=>{
            console.log(req.params.id)
            await Library.findOneAndUpdate({_id:req.params.id},{
                
                $set:{
                    book_name : req.body.book_name,
                    author_name : req.body.author_name,
                    year_published : req.body.year_published,
                    price : req.body.price,
                    discount : req.body.discount,
                    no_of_pages : req.body.no_of_pages,
                    condition : req.body.condition
                }

            },{new:true})              
            .then(result=>{
                res.status(200).json({
                    updated_data : result
                })
            })
            .catch(err=>{
                console.log(err);
                res.status(500).json({
                    error : err
                })
            })

        })

        //DELETE API
        app.delete("/delete/book/:id",async(req,res)=>{
            try {
                const book = await Library.deleteOne({_id:req.params.id});
                res.status(200).json({
                    message : `${book} deleted`
                })
                
            } catch (err) {
                res.status(500).json({
                    message : err
                })
                
            }
        })



app.listen(5000,()=>console.log('listening at port 5000'));