class OrderDTO {
    constructor({
        type,                  
        quantity,             
        price,                
        stockSymbol,           
        investorId,            
        date,                  
        status                 
    }) {
        this.type = type;             
        this.quantity = quantity;        
        this.price = price;               
        this.stockSymbol = stockSymbol;  
        this.investorId = investorId;    
        this.date = date;                
        this.status = status;            
    }
}

module.exports = OrderDTO;
