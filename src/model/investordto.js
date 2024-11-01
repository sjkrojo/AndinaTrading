class InvestorDTO {
    constructor({
        id,
        name,
        address,
        phone,
        riskProfile,
        investmentCapacity,
        profitStatus,
        contracts = [],
    }) {
        this.id = id;                        
        this.name = name;                       
        this.address = address;                
        this.phone = phone;                    
        this.riskProfile = riskProfile;        
        this.investmentCapacity = investmentCapacity; 
        this.profitStatus = profitStatus;
        this.contracts = contracts;                      
    }
}

module.exports = InvestorDTO;