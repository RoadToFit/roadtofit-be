import { Application } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI, { SwaggerOptions } from 'swagger-ui-express';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RoadToFit API Docs',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

const swaggerOptions: SwaggerOptions = {
  swaggerOptions: {
    apisSorter: 'alpha',
    tagsSorter: 'alpha',
  }
}

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app: Application) => {
  app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec, swaggerOptions));
}

export default swaggerDocs;