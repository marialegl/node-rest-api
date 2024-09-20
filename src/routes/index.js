const { Router } = require('express');
const fs = require('fs');

const router = Router();

const readData = () => {
    try {
        const data = fs.readFileSync("./db.json");
        return JSON.parse(data);
    } catch (error) {
        console.log(error);  
    }
};

const writeData = (data) => {
    try {
        fs.writeFileSync("./db.json", JSON.stringify(data));
    } catch (error) {
        console.log(error);  
    }
}


//Raiz
router.get('/', (req, res) => {    
    res.json(
        {
            "Title": "Hola mundo usando rutas!"
        }
    );
});

router.get("/books", (req, res) => {
    const data = readData();
    res.json(data.books);
});

router.get("/books/title/:title", (req, res) => {
    const data = readData();
    const title = req.params.title;
    const book = data.books.find((book) => book.title === title);
    res.json(book);
});

router.get("/books/year/:publication_year", (req, res) => {
    const data = readData();
    const publication_year = parseInt(req.params.publication_year);
    const book = data.books.filter((book) => book.publication_year === publication_year);
    res.json(book)
});

router.post("/books", (req, res) => {
    const data = readData();
    const body = req.body;

    const requiredFields = [
        "title", "author", "publisher", "publication_year", "genre", 
        "topics", "summary", "rating", "page_count", "language",
        "isbn", "image_url", "platforms", "amazon_price"
    ];

    const missingFields = requiredFields.filter(field => !body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json({
            message: "Faltan los siguientes campos obligatorios: " + missingFields.join(", ")
        });
    }

    // Crear el nuevo libro si todos los campos están presentes
    const newBook = {
        id: data.books.length + 1,
        ...body
    };

    data.books.push(newBook);
    writeData(data);
    res.json(newBook);
});

router.put("/books/:id", (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);
    const bookIndex = data.books.findIndex((book) => book.id === id);
    data.books [bookIndex] = {
        ...data.books[bookIndex],
        ...body,
    };
    writeData(data);
    res.json({ message: "Book updated successfully" });
});

router.delete("/books/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const bookIndex = data.books.findIndex((book) => book.id === id);
    data.books.splice(bookIndex, 1);
    writeData(data);
    res.json({ message: "Book deleted successfully" });
});

module.exports = router;
