# walletProject

To run this project we have to run a couple of commands

npm i  
npm start  

This project uses node.js v14.18.1 and mongodb as database  
By default the application will launch on port 4007  
The mongodb should be running on port 27017  

Both of these can be changed in the serverConfig.js file.  

The project follows classical MVC pattern.  


Deployment details  
App is hosted on an EC2 instance with the details as following  

Server IP -- 54.232.193.93  
Port      -- 4010  

Following are the endpoint details  

http://54.232.193.93:4010/setup  
Body--  
{
    "balance": "50",
    "name": "hewallet2llo"
}

http://54.232.193.93:4010/transact/:walletID  
Body--  
{
    "amount": -140.0502,
    "description": "Recharge"
}

http://54.232.193.93:4010/transactions?walletId=61dc07e4715b9b4904f3abd6&skip=0&limit=10  

http://54.232.193.93:4010/wallet?id=61dc07e4715b9b4904f3abd6
