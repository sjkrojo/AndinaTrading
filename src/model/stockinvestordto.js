class stockInvestorDTO {
    constructor({     
        id, 
        quantity,             
        originalprice,   
        actualprice,                
        stockid,                  
        date                            
    }) {
        this.id = id;             
        this.quantity = quantity;        
        this.originalprice = originalprice;               
        this.actualprice = actualprice;  
        this.stockid = stockid;    
        this.date = date;                   
    }
}

module.exports = stockInvestorDTO;
