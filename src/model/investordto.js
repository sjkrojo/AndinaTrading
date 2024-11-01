class InvestorDTO {
    constructor({
        id,
        name,
        address,
        phone,
        riskProfile,
        investmentCapacity,
        profitStatus,
        stockList = [],
        contracts = [],
    }) {
        this.id = id;                        
        this.name = name;                       
        this.address = address;                
        this.phone = phone;                    
        this.riskProfile = riskProfile;        
        this.investmentCapacity = investmentCapacity; 
        this.profitStatus = profitStatus;
        this.stockList = stockList;            
        this.contracts = contracts;                      
    }
}

module.exports = InvestorDTO;