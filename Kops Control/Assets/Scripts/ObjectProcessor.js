#pragma strict

import System;
import System.Collections;
import System.Xml;
import System.Xml.Serialization;
import System.IO;
import System.Text;

var objectsAdded : int;
var allObjectData : SerializableData;
private var loadButtonRectangle : Rect;
private var saveButtonRectangle : Rect;
private var SerializerFileLocation : String;
private var SerializerFileName : String = "ObjectData.xml";

// Stores data on a component
class ComponentData
{
	var name : String;
}

// Stores data on an object
class ObjectData
{
	var prefabName : String;
	var instanceName : String;
    var xPosition : float;
    var yPosition : float;
    var zPosition : float;
    var xRotation : float;
    var yRotation : float;
    var zRotation : float;
    var xScale : float;
    var yScale : float;
    var zScale : float;
    var components : ComponentData[];
}

// Stores data for objects to be serialized
class SerializableData
{
    public var data : ObjectData[]; // TODO: Need constructor call???    
    function SerializableData() { }
}

// Gets the Component's name from the string containing its name and the parent object's name
function GetActualComponentName(originalName : String) : String
{
	var seperators : String = "()";
	return originalName.Split(seperators.ToCharArray())[1];
}

// Processes all entries in the SerializableData container into game objects
function ProcessDataIntoObjects()
{
	for (var count : int = 0; count < allObjectData.data.Length; count++)
	{
		ProcessDataIntoObject(allObjectData.data[count]);
	}
}

// Processes an ObjectData instance into a game object
function ProcessDataIntoObject(data : ObjectData)
{
	try
	{
		var currentObject : GameObject = Instantiate(UnityEngine.Resources.Load(data.prefabName)) as GameObject;
		currentObject.name = data.instanceName;
		currentObject.transform.position.x = data.xPosition;
		currentObject.transform.position.y = data.yPosition;
		currentObject.transform.position.z = data.zPosition;	
		currentObject.transform.eulerAngles.x = data.xRotation;
		currentObject.transform.eulerAngles.y = data.yRotation;
		currentObject.transform.eulerAngles.z = data.zRotation;	
		currentObject.transform.localScale.x = data.xScale;
		currentObject.transform.localScale.y = data.yScale;
		currentObject.transform.localScale.z = data.zScale;
	}
	catch(err)
	{
		Debug.Log("Null Object : " + currentObject.name + " from " + data.prefabName + ".");
	
	}
	
	Debug.Log("Object created : " + currentObject.name + " from " + data.prefabName + ".");
}

// Processes all objects created from prefabs into the SerializableData container
function ProcessObjectsIntoData()
{
	// Retrieve all game objects
	var gameObjects : GameObject[] = FindObjectsOfType(GameObject) as GameObject[];	
	
	// Set up data storage
	objectsAdded = 0;
	allObjectData = new SerializableData(); 	
	var prefabObjectCount = 0;	
	for (var count : int = 0; count < gameObjects.Length; count++)
	{	
		if (null != PrefabUtility.GetPrefabParent(gameObjects[count]))
		{
			prefabObjectCount++;
		}
	}
	
	allObjectData.data = new ObjectData[prefabObjectCount];
	
	// Loop through all game objects
	for (var objectCount : int = 0; objectCount < gameObjects.Length; objectCount++)
	{	
		// Check if the object is created from a prefab
		if (null != PrefabUtility.GetPrefabParent(gameObjects[objectCount]))
		{
			// Assign the prefab name and process the game object
			var thePrefab : GameObject = PrefabUtility.GetPrefabParent(gameObjects[objectCount]);			
			allObjectData.data[objectsAdded] = new ObjectData();
			allObjectData.data[objectsAdded].prefabName = thePrefab.name.ToString();
			ProcessObjectIntoData(gameObjects[objectCount]);
			objectsAdded++;
		}
	}
}

// Processes an individual game object into the SerializableData container
function ProcessObjectIntoData(objectToProcess : GameObject)
{
	// Add instance properties
	allObjectData.data[objectsAdded].instanceName = objectToProcess.name.ToString();	
	allObjectData.data[objectsAdded].xPosition = objectToProcess.transform.position.x;
    allObjectData.data[objectsAdded].yPosition = objectToProcess.transform.position.y;
    allObjectData.data[objectsAdded].zPosition = objectToProcess.transform.position.z;
    allObjectData.data[objectsAdded].xRotation = objectToProcess.transform.eulerAngles.x;
    allObjectData.data[objectsAdded].yRotation = objectToProcess.transform.eulerAngles.y;
    allObjectData.data[objectsAdded].zRotation = objectToProcess.transform.eulerAngles.z;
    allObjectData.data[objectsAdded].xScale = objectToProcess.transform.localScale.x;
    allObjectData.data[objectsAdded].yScale = objectToProcess.transform.localScale.y;
    allObjectData.data[objectsAdded].zScale = objectToProcess.transform.localScale.z;
	
	// Retrieve components
	var components : Component[];
	components = objectToProcess.GetComponents(typeof(Component));
	
	// Create componant storage space
	var nonUnityComponents : int = 0;
	for (var count : int = 0; count < components.Length; count++)
	{	
	Debug.Log(components[count].ToString());
		if (!components[count].ToString().Contains("UnityEngine"))
		{
			nonUnityComponents++;
		}	
	}
	allObjectData.data[objectsAdded].components = new ComponentData[nonUnityComponents];
	var componentsAdded : int = 0;
	
	for (var componentCount : int = 0; componentCount < components.Length; componentCount++)
	{	
		if (!components[componentCount].ToString().Contains("UnityEngine"))
		{
			// Get the component and add it to the array
			var theComponent : Component = objectToProcess.GetComponent(GetActualComponentName(components[componentCount].ToString()));
			allObjectData.data[objectsAdded].components[componentsAdded] = new ComponentData();
			allObjectData.data[objectsAdded].components[componentsAdded].name = theComponent.GetType().ToString();
			componentsAdded++;
		}
	}
}

// Outputs debug data from processing game objects into arrays
function OutputObjectProcessorData()
{	
	for	(var count : int = 0; count < allObjectData.data.Length; count++)
	{
		if (null != allObjectData.data[count])
		{
			Debug.Log(allObjectData.data[count].prefabName + " - " + allObjectData.data[count].instanceName);
			for	(var innerCount : int = 0; innerCount < allObjectData.data[count].components.Length; innerCount++)
			{
				if (null != allObjectData.data[count].components[innerCount])
				{
					Debug.Log(allObjectData.data[count].components[innerCount].name);
				}
			}
		}
	}
}

// Converts a UTF8 formatted byte array to a String
function UTF8ByteArrayToString(characters : byte[])
{     
    var encoding : UTF8Encoding  = new UTF8Encoding();
    var constructedString : String  = encoding.GetString(characters);
    return (constructedString);
}

// Converts a String to a UTF8 formatted byte array
function StringToUTF8ByteArray(stringToConvert : String)
{
   var encoding : UTF8Encoding  = new UTF8Encoding();
   var byteArray : byte[]  = encoding.GetBytes(stringToConvert);
   return byteArray;
}

// Serializes an instance of SerializableData
function SerializeData(objectToSerialize : Object)
{
    var dataAsXml : String  = null;
    var memoryStream : MemoryStream  = new MemoryStream();
    var serializer : XmlSerializer = new XmlSerializer(typeof(SerializableData));
    var xmlTextWriter : System.Xml.XmlTextWriter = new System.Xml.XmlTextWriter(memoryStream, Encoding.UTF8);
    serializer.Serialize(xmlTextWriter, objectToSerialize);
    memoryStream = xmlTextWriter.BaseStream;
    dataAsXml = UTF8ByteArrayToString(memoryStream.ToArray());
    return dataAsXml;
}

// Deserializes correctly formatted xml data into a SerializableData instance
function DeserializeData(dataAsXml : String)   
{
   var serializer : XmlSerializer  = new XmlSerializer(typeof(SerializableData));
   var memoryStream : MemoryStream  = new MemoryStream(StringToUTF8ByteArray(dataAsXml));
   return serializer.Deserialize(memoryStream);
}

// Loads the data from an xml file and returns it as a String 
function LoadXML()
{
   var reader : StreamReader = File.OpenText(SerializerFileLocation + "/" + SerializerFileName);
   var data : String = reader.ReadToEnd();
   reader.Close();
   return data;
}

// Writes the string passed in to an xml file
function WriteXMLFile(dataAsString : String)
{
    var writer : StreamWriter;    
    var file : FileInfo = new FileInfo(SerializerFileLocation+ "/" + SerializerFileName);
    
    if(!file.Exists)
    {
        writer = file.CreateText();
    }
    else
    {
        file.Delete();
        writer = file.CreateText();
    }
    writer.Write(dataAsString);
    writer.Close();
    Debug.Log("File written.");
}

// Saves the data
function SaveData()
{
	ProcessObjectsIntoData();
	var dataAstext = SerializeData(allObjectData);
	Debug.Log(dataAstext);
	WriteXMLFile(dataAstext);
	Debug.Log("Data serialized to " + SerializerFileLocation + ".");
}

// Loads the data
function LoadData()
{
	var dataAstext = LoadXML();	
	if (dataAstext != String.Empty)
	{
		Debug.Log(dataAstext);		
		allObjectData = DeserializeData(dataAstext);
    	ProcessDataIntoObjects();
		Debug.Log("Data deserialized from " + SerializerFileLocation + ".");
	}   
}

// Runs at start
function Start() 
{
	SerializerFileLocation = Application.dataPath;	
	loadButtonRectangle = new Rect(10, 80, 100, 20);
	saveButtonRectangle = new Rect(10, 100, 100, 20);	
}

// Runs during each game update cycle
function Update() 
{
}

// Creates the load/save GUI and handles GUI events
function OnGUI()
{	
	if(GUI.Button(loadButtonRectangle, "Load"))
	{    
		LoadData();
	}	
	if(GUI.Button(saveButtonRectangle, "Save"))
	{    
		SaveData();
	} 
}