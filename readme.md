##

`npm install typescript ts-node @types/node @types/express @types/mongoose @types/jsonwebtoken @types/bcrypt dotenv`
`npx tsc --init`

curl -X POST http://localhost:5555/api/auth/log-in \
-c ./cookies.txt \
-H "Content-Type: application/json" \
-d '{
"email": "testuser@example.com",
"password": "securepassword123"
}'

curl -X POST http://localhost:5555/api/auth/sign-up \
-H "Content-Type: application/json" \
-d '{
"email": "testuser@example.com",
"password": "securepassword123"
}'

curl -X GET "http://localhost:5555/api/auth/refresh-token?refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NWE1ZWFmMjM5ODgyYzA0OTZiNTk1YyIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzE3MjA3MDY1LCJleHAiOjE3MTc4MTE4NjV9.jQBGttRJVrZFoDgQlk7bv-PjT621gqOQ2_MM8EwAhNU" \
-H "Content-Type: application/json"
