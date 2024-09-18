const { Client } = require('@notionhq/client')
const log = require('./logger');
require('dotenv').config()
const { HttpsProxyAgent } = require('https-proxy-agent');


const notion = new Client({ auth: process.env.NOTION_SECRET_KEY, agent: new HttpsProxyAgent(process.env.notionProxy) });


async function addItem() {
  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        // Замените 'Название' на имя вашего свойства в базе данных
        'Название': {
          title: [
            {
              text: {
                content: 'Название новой записи',
              },
            },
          ],
        },
        // Пример для текстового свойства
        'Описание': {
          rich_text: [
            {
              text: {
                content: 'Описание новой записи',
              },
            },
          ],
        },
        // Пример для числа
        'Приоритет': {
          number: 1,
        },
        // Пример для чекбокса
        'Выполнено': {
          checkbox: true,
        },
        // Пример для даты
        'Дата': {
          date: {
            start: '2024-05-26',
          },
        },
      },
    });
    console.log('Запись добавлена успешно:', response);
  } catch (error) {
    console.error('Ошибка при добавлении записи:', error);
  }
}

async function findPageByTitle(database, title) {
    const database_id = process.env.notionDatabaseID;
    const property = process.env.keyPropertyName;
    const response = await notion.databases.query({
      database_id: database_id,
      filter: {
        property: property, 
        title: {
          equals: title,
        },
      },
    });
    if (response.results.length > 0) {
      return response.results[0];
    } else {
      log.warn(`Notion error: ${title} not found in ${database}`);
      return null;
    }
  }
  
async function updatePageProperty(pageId, propertyName, newValue) {
    const properties = {};
    properties[propertyName] = newValue;
    const response = await notion.pages.update({
        page_id: pageId,
        properties: properties,
    });
  }
  

async function findAndUpdatePage(database, title, propertyName, newValue) {
    try {
        const page = await findPageByTitle(database, title);
        if (page) 
            await updatePageProperty(page.id, propertyName, newValue);
    } 
    catch (error) {
        if (error.code == "ETIMEDOUT")
            return findAndUpdatePage(database, title, propertyName, newValue);
        log.warn(`Notion error: ${title} update ${propertyName}. Error: ${error}`);
        return false;
    }
    return true;
};

async function findAndUpdateCheckbox(database, title, propertyName, newValue) {
    try {
        const page = await findPageByTitle(database, title);
  
        if (page) {
            const properties = {};
            properties[propertyName] = {
                checkbox: newValue,
            };
            const response = await notion.pages.update({
                page_id: page.id,
                properties: properties,
            });
        }
    } catch (error) {
        log.error(`Notion error: ${title} update ${propertyName}. Error: ${error}`);
    }
};

module.exports = {
    findAndUpdatePage,
    findAndUpdateCheckbox
}