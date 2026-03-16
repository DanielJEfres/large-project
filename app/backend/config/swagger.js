import swaggerJsdoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0', 
    info: {
        title: "EventKnight API",
        version: "1.0.0",
        description: "API documentation for EventKnight"
    }
},
apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;