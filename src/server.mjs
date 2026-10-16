import express from 'express';

const server = express();
const PORT = process.env.PORT || 8090;


/*
-----------------------------------------------------
    Mock Data
-----------------------------------------------------
*/
const mockUsersData = [
    {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com'
    },
    {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com'
    },
    {
        id: 3,
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob.johnson@example.com'
    },
    {
        id: 4,
        firstName: 'Alice',
        lastName: 'Williams',
        email: 'alice.williams@example.com'
    },
    {
        id: 5,
        firstName: 'Charlie',
        lastName: 'Brown',
        email: 'charlie.brown@example.com'
    },
    {
        id: 6,
        firstName: 'Emily',
        lastName: 'Davis',
        email: 'emily.davis@example.com'
    },
    {
        id: 7,
        firstName: 'David',
        lastName: 'Wilson',
        email: 'david.wilson@example.com'
    },
    {
        id: 8,
        firstName: 'Spenser',
        lastName: 'Doe',
        email: 'david.wilson@example.com'
    }
];





/*
-----------------------------------------------------
    Middleware
-----------------------------------------------------
*/
server.use(express.json());


function resolveIndexByID(request, response, next) {
    const { id } = request.params;
    const parsedID = parseInt(id);
    if (isNaN(parsedID))
        response
            .status(400)
            .send('Bad Request. Invalid ID');
    
    const userIndex = mockUsersData.findIndex(user => user.id === parsedID);
    if (userIndex === -1)
        response
            .status(404)
            .send('User Not Found');

    request['userIndex'] = userIndex;
    next();
}









/*
-----------------------------------------------------
    EndPoints or Routes
-----------------------------------------------------
*/
server.get('/', (_, response) => response.status(200).send('Welcome to Express JS Learning'));


server.get('/api/users', (request, response) => {
    const { filter, value } = request.query;
    if (filter && value) {
        const users = mockUsersData.filter(user => user[filter].includes(value));
        !users.length && (response.status(404).send({ message: `No user found by ${filter} with the value ${value}` }));
        response
            .status(200)
            .send(users);
    }
    response
        .status(200)
        .send(mockUsersData);
});


server.get('/api/users/:id', resolveIndexByID, (request, response) => {
    const { userIndex } = request;
    const user = mockUsersData[userIndex];
    if (!user)
        response
            .status(404)
            .send('User Not Found');
            
    response
        .status(200)
        .send(user);
});


server.post('/api/users', (request, response) => {
    if (!request['body'])
        response
            .status(400)
            .send({ message: 'Bad Request' });

    //add new id
    const id = mockUsersData[mockUsersData.length - 1].id + 1;
    const newUser = {
        id,
        ...request['body']
    };
    
    mockUsersData.push(newUser);
    response
        .status(200)
        .send(newUser);
});


server.put('/api/users/:id', resolveIndexByID, (request, response) => {
    const { body, userIndex } = request;
    const { id } = mockUsersData[userIndex];

    mockUsersData[userIndex] = {
        id,
        ...body
    };

    response.sendStatus(200);
});


server.patch('/api/users/:id', resolveIndexByID, (request, response) => {
    const { body, userIndex } = request;

    mockUsersData[userIndex] = {
        ...mockUsersData[userIndex],
        ...body
    };

    response.sendStatus(200);
});


server.delete('/api/users/:id', resolveIndexByID, (request, response) => {
    const { userIndex } = request;
    mockUsersData.splice(userIndex, 1);
    response
        .status(200)
        .send('User deleted');
});




/*
--------------------------------------------------------------
    Listen to all incoming requests on the specified port
    URL-> http://localhost:8090
--------------------------------------------------------------
*/
server.listen(PORT);