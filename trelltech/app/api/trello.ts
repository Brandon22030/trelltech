
const API_KEY = null;

// API_KEY = 6a6c6f59721b1ca0e78fbfa3b31a47e9


const TOKEN = null;


const BASE_URL = "https://api.trello.com/1/";

const getRequest = async (endpoint: string) => {

  const url = `${BASE_URL}${endpoint}?key=${API_KEY}&token=${TOKEN}`;

  const response = await fetch(url);

  const data = await response.json();

  if(!data.ok){

    throw new Error(`Error: ${response.status}`);

  }

  return data;

};

const postRequest = async (endpoint: string, body: object) =>{

  const url = `${BASE_URL}${endpoint}?key=${API_KEY}&token=${TOKEN}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type':'application/json'
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  return await response.json();

};

// API FUNCTIONS WITH TYPES
export const getBoards = (boardId: string) => {
  
  getRequest(`boards/${boardId}`);

};

export const createBoard = (name: string) => {

  postRequest("boards/?name=", {name})

}