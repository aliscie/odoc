dfx canister create backend
dfx canister create ic_siwe_provider

dfx deploy ic_siwe_provider --argument $'(
    record {
        domain = "localhost";
        uri = "http://localhost:5173";
        salt = "mysecretsalt123";
        chain_id = opt 1;
        scheme = opt "http";
        statement = opt "Login to the app";
        sign_in_expires_in = opt 300000000000;    
        session_expires_in = opt 604800000000000;
        targets = opt vec {
            "'$(dfx canister id ic_siwe_provider)'"; 
            "'$(dfx canister id backend)'"; 
        };
    }
)'

dfx deploy backend

dfx generate
