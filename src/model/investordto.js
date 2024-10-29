class InvestorDTO {
    constructor({
        name,
        address,
        phone,
        email,
        riskProfile,
        investmentCapacity,
        profitStatus,
        transactions = [],
        stockList = [],
        contracts = [],
        login,
        password
        
    }) {
        this.name = name;                      
        this.address = address;                
        this.phone = phone;                    
        this.email = email;                    
        this.riskProfile = riskProfile;        
        this.investmentCapacity = investmentCapacity; 
        this.profitStatus = profitStatus;
        this.transactions = transactions;      
        this.stockList = stockList;            
        this.contracts = contracts;            
        this.login = login;                    
        this.password = password;              
    }

    // Optional methods for adding transactions, stocks, or contracts
    addTransaction(transaction) {
        this.transactions.push(transaction);
    }

    addStock(stock) {
        this.stockList.push(stock);
    }

    addContract(contract) {
        this.contracts.push(contract);
    }
}

module.exports = InvestorDTO;
