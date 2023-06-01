exports.handler = async(event,context) =>{
    const data = {hello: "Hello world."}
    return{
        statusCode: 200, // HTTP status code. 0 = success. Default is 200.
        body: JSON.stringify(data),
    }
}