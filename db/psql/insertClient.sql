INSERT INTO clients (client_name, client_email, client_birthday, client_company, client_zipcode, client_title, client_image, client_interests) 
VALUES ($1, $2, $3, $4, $5, $6, $7, $8);

SELECT client_id from clients where client_name = $1;