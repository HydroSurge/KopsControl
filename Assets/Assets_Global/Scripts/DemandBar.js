#pragma strict
import System.IO;

class DemandBar {

	private var mLineMaterial	:	Material;		// Material for the graph line.
	private var mPosition		:	Vector2;		// Position of the bottom left corner of the graph
	private var mWidth			:	float;			// Width of the graph.
	private var mHeight			:	float;			// Height of the graph.
	private var mPoints			:	Vector2[];		// Array of points for the graph.
	private var mLastMoved		:	float;			// Time since the graph was last updated.
	private var mPointsToShow	:	int;			// Number of points to graph.	
	private var mCurTime		:	float;			// Current time.
	private var mScale			:	float;			// Scales the y positions of the graph points.
	private var mPowerLvl		:	float;			// The players current power output.
	private var mCurDemand		:	float;			// The current power demand.
	private var mMaxDemand		:	float;			// Maximum possible power demand.
	
	private var mPoints3D		:	Vector3[];
	private var mPosition3D		:	Vector3;
	private var m3DWidth		:	float;
	private var mLastMoved3D	:	float;
	private var mCurTime3D		:	float;
	private var xScale3D		:	float;
	
	function DemandBar(pPos2D : Vector2, pPos3D : Vector3, pWidth : int, pHeight : int, pMaxDemand : float) {

		mPosition		=	pPos2D;
		mWidth			=	pWidth;
		mHeight			=	pHeight;
		mLastMoved		=	0;
		mPointsToShow	=	12;
		mCurTime		=	0;
		mScale			=	pHeight/100;
		mPowerLvl		= 	0;
		mCurDemand		= 	0;
		mMaxDemand		=	pMaxDemand;
		mPosition3D		=	pPos3D;
		m3DWidth		=	12;
		xScale3D		=	0.75;
		
		GenerateDemandData();

		// Set line material
		mLineMaterial = new Material( "Shader \"Lines/Colored Blended\" {" +
	        "SubShader { Pass { " +
	        "    Blend SrcAlpha OneMinusSrcAlpha " +
	        "    ZWrite Off Cull Off Fog { Mode Off } " +
	        "    BindChannels {" +
	        "      Bind \"vertex\", vertex Bind \"color\", color }" +
	        "} } }" );
	    mLineMaterial.hideFlags = HideFlags.HideAndDontSave;
	    mLineMaterial.shader.hideFlags = HideFlags.HideAndDontSave;
	}
	
	/*
	*	Updates the graph based on time passed
	*/
	function Update(pDeltaTime : float) {
		
		// Update graph based on time passed (Currently every second)
		mLastMoved += pDeltaTime;
		if(mLastMoved >= 1) {
			if(mPosition.x+mCurTime < mPosition.x+mWidth) {
				mCurTime += mWidth/(60);
			}
			else {
				mCurTime = 0;
				mCurTime3D = 0;
				
				MainGame.Instance().CompleteLevel();
			}
			mLastMoved = 0;
		}
		
		// Update current demand
		var point 		: 	int 	= -1;
		var pointFound 	: 	boolean = false;

		for(var i = 0; i < mPoints.Length-1; i++) {
			if(mPoints[i].x < (mPosition.x+mCurTime) && mPoints[i+1].x > (mPosition.x+mCurTime)) {
				point = i;
				pointFound = true;
			}
		}
		if(point != -1) {
			var tempDemand = mCurDemand;
			mCurDemand = Intersection(mPoints[point], mPoints[point+1], Vector2(mPosition.x+(mCurTime), mPosition.y), Vector2(mPosition.x+(mCurTime), mPosition.y+mHeight));
			if(mCurDemand == -1) {
				mCurDemand = tempDemand;
			}
			else {
				mCurDemand -= mPosition.y;
			}
		}
	}
	
	function Update3D(pDeltaTime : float) {
	
		mLastMoved3D += pDeltaTime;
		if(mLastMoved3D >= 1) {
			mCurTime3D += m3DWidth/(60);
			mLastMoved3D = 0;
		}
	}
	
	function Set3DPos(pPos : Vector3) {
		mPosition3D = pPos;
	}
	
	function DrawGraph3D(pPlayerPower : float, renderer : LineRenderer, pOutput : LineRenderer, pDemand : LineRenderer, pCurTime : LineRenderer) {
		
		mPowerLvl = pPlayerPower;
	
		renderer.SetVertexCount(mPointsToShow+1);
		renderer.SetWidth(0.05, 0.05);
		var c1 = Color.red;
		renderer.SetColors(c1, c1);
		renderer.material = new Material (Shader.Find("Particles/Additive"));
		
		for (var j = 0; j <= mPointsToShow; j++) {
			renderer.SetPosition(j, mPoints3D[j]);
		}
		//renderer.SetPosition(j+1, mPoints3D[j+1]);
		
		pOutput.SetWidth(0.05, 0.05);
		var c2 = Color.green;
		pOutput.SetColors(c2, c2);
		pOutput.material = new Material (Shader.Find("Particles/Additive"));
		
		var radius 	= 	0.08*mScale;
	    var sides	=	10;
	    pOutput.SetVertexCount(sides+1);
	    for (j = 0; j <= sides; j++) {		
			pOutput.SetPosition(j, Vector3((radius * Mathf.Cos(j * (2 * Mathf.PI) / sides)) + (mPosition3D.x-mCurTime3D)*xScale3D , (radius * Mathf.Sin(j * (2 * Mathf.PI) / sides)) + mPosition3D.y+(((mHeight/100)*pPlayerPower)/100), mPosition3D.z));
	    }
	    
	    pCurTime.SetWidth(0.02, 0.02);
		var c3 = Color.yellow;
		pCurTime.SetColors(c3, c3);
		pCurTime.material = new Material (Shader.Find("Particles/Additive"));
	    pCurTime.SetVertexCount(2);
	    
	    pCurTime.SetPosition(0, Vector3((mPosition3D.x-mCurTime3D)*xScale3D, mPosition3D.y, mPosition3D.z));
	    pCurTime.SetPosition(1, Vector3((mPosition3D.x-mCurTime3D)*xScale3D, mPosition3D.y+2, mPosition3D.z));
	    
	    pDemand.SetWidth(0.02, 0.02);
		var c4 = Color.cyan;
		pDemand.SetColors(c4, c4);
		
		pDemand.material = new Material (Shader.Find("Particles/Additive"));
	    radius 	= 	0.05*mScale;
	    sides	=	5;
	    
	    pDemand.SetVertexCount(sides+1);
	    for (j = 0; j <= sides; j++) {		
			pDemand.SetPosition(j, Vector3((radius * Mathf.Cos(j * (2 * Mathf.PI) / sides)) + (mPosition3D.x-mCurTime3D)*xScale3D , (radius * Mathf.Sin(j * (2 * Mathf.PI) / sides)) + mPosition3D.y+(mCurDemand/100), mPosition3D.z));
	    }
	}
	
	/*
	*	Draws the 2D energy demand graph
	*/
	function DrawGraph2D(pPlayerPower : float)
	{
		GUI.BeginGroup(Rect (mPosition.x-50, Screen.height-mPosition.y-mHeight-50, mWidth+100, mHeight+100));	
			GUI.Box(Rect (50, 30, mWidth, mHeight+20), "Energy Demand");
			GUI.Label(Rect (30, mHeight+35, 50, 50), "0%");
			GUI.Label(Rect (18, 45, 50, 50), "100%");
			GUI.Label(Rect (50, mHeight+50, 50, 50), "12AM");
			GUI.Label(Rect (mWidth+20, mHeight+50, 50, 50), "12PM");
			GUI.Label(Rect(mCurTime+50+(6*mScale), mHeight+50-mPowerLvl-10, 50, 50), ""+(mPowerLvl/mScale)+"%");
		GUI.EndGroup();
	
		mPowerLvl = pPlayerPower*mScale;
		mLineMaterial.SetPass(0);
		GL.PushMatrix();
        GL.LoadPixelMatrix();
		
		// Draw graph
		GL.Color( Color(1.0f, 1.0f, 1.0f, 1) );
		GL.Begin( GL.LINES );
			GL.Vertex(mPosition);
			GL.Vertex(Vector2(mPosition.x, mPosition.y+mHeight));
			GL.Vertex(Vector2(mPosition.x+mWidth, mPosition.y));
			GL.Vertex(mPosition);
			
			var tickXPos = mPosition.x;
			for(var i = 0; i < 12; i++) {
			
				GL.Vertex(Vector2(tickXPos, mPosition.y+5));
		    	GL.Vertex(Vector2(tickXPos, mPosition.y-5));
		    	
		    		tickXPos += mWidth/12;	
			}
			
			// Draw current time marker
			GL.Color( Color(1.0f, 1.0f, 0.0f, 1) );
			GL.Vertex(Vector2(mPosition.x+(mCurTime), mPosition.y));
			GL.Vertex(Vector2(mPosition.x+(mCurTime), mPosition.y+mHeight));
			
			// Draw current power output marker
			GL.Color( Color(0.1f, 1.0f, 0.1f, 1) );
			var radius 	= 	5*mScale;
			var sides 	= 	20;
			for (var j = 0; j < sides; j++) {		
				GL.Vertex(Vector2((radius * Mathf.Cos(j * (2 * Mathf.PI) / sides)) + mPosition.x+mCurTime , (radius * Mathf.Sin(j * (2 * Mathf.PI) / sides)) + mPosition.y+mPowerLvl));
		    }	    
		    GL.Vertex(Vector2(mPosition.x+mCurTime-radius, mPosition.y+mPowerLvl));
		    GL.Vertex(Vector2(mPosition.x+mCurTime+radius, mPosition.y+mPowerLvl));
		    
		    // Draw current power demand marker
		    GL.Color( Color(1.0f, 0.1f, 0.1f, 1) );
		    radius 	= 	4*mScale;
		    sides	=	10;
		    for (j = 0; j < sides; j++) {		
				GL.Vertex(Vector2((radius * Mathf.Cos(j * (2 * Mathf.PI) / sides)) + mPosition.x+mCurTime , (radius * Mathf.Sin(j * (2 * Mathf.PI) / sides)) + mPosition.y+mCurDemand));
		    }

			// Draw points
			GL.Color( Color(1.0f, 0.1f, 0.1f, 1) );
			for(i = 0; i < mPointsToShow; i++) {
				GL.Vertex(mPoints[i]);
				GL.Vertex(mPoints[i+1]);
			}
		GL.End();
        GL.PopMatrix();
	}
	
	/*
	*	Checks if the players current power output is greater then the current demand
	*	and returns the result.
	*/
	function IsAboveDemand() {
	
		if(mPowerLvl > mCurDemand) {
			return true;
		}
		return false;
	}
	
	/*
	*	Returns the power demand at the current time.
	*/
	function GetCurrentDemand() {
	
		return (mMaxDemand/100)*(mCurDemand/mScale);
	}
	
	/*
	*	Randomly generates a new set of data for the graph.
	*/
	function GenerateDemandData() {
	
		var pointCount = 0;
		var lastVal = 0;
		mPoints = new Vector2[mPointsToShow+1];
		mPoints3D = new Vector3[mPointsToShow+1];
		mCurTime = 0;
		for(var i = 0; i < mPointsToShow+1; i++) {
			var val = 0;
			var cont = false;
			while(!cont) {
				val = (Random.Range(25, mMaxDemand)/mMaxDemand)*100;
				
				// Even out the data in order to avoid huge spikes in demand.
				if(pointCount > 0 && Mathf.Abs(val - lastVal) < 25) {
					cont = true;
				}
				else if(pointCount == 0) {
					cont = true;
				}
			}
			lastVal = val;
			mPoints[i] = (Vector2(mPosition.x+(pointCount*(mWidth/mPointsToShow)), (((mHeight/100)*val))+mPosition.y));
			mPoints3D[i] = Vector3((mPosition3D.x+((-pointCount*(m3DWidth/mPointsToShow))))*xScale3D, mPosition3D.y+(((mHeight/100)*val)/100), mPosition3D.z);
	    	pointCount++;
		}
	}
	
	/*
	*	Loads the graph data from a .txt file.
	*/
	private function LoadDataFromFile() {
	
		var sr = new StreamReader(Application.dataPath + "/" + "GraphData.txt");
	    var fileContents = sr.ReadToEnd();
	    sr.Close();
	 
	    var lines = fileContents.Split("\n"[0]);
	    mPoints = new Vector2[lines.Length];
	    var pointCount = 0;
	    for (line in lines) {
	    	var val = (parseInt(line)/mMaxDemand)*100;
	    		    	
	    	mPoints[pointCount] = (Vector2(mPosition.x+(pointCount*(mWidth/mPointsToShow)), (((mHeight/100)*val))+mPosition.y));
	    	pointCount++;
	    }
	}
	
	/*
	*	Checks for an intersection between two lines and returns the y value of the result.
	*	Used to find the energy demand at the current time.
	*/
	private function Intersection(p1 : Vector2 , p2 : Vector2, p3 : Vector2, p4 : Vector2) {
		
		// Given two lines, the first line is p1-p2
		// the second line is p3-p4	
		var x1 = p1.x; 
		var x2 = p2.x; 
		var x3 = p3.x; 
		var x4 = p4.x;
		
		var y1 = p1.y;
		var y2 = p2.y;
		var y3 = p3.y;
		var y4 = p4.y;
		
		var d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
		// If d is zero, there is no intersection
		if (d == 0) { 
			return -1;
		}
		// Get the x and y
		var pre = (x1*y2 - y1*x2);
		var post = (x3*y4 - y3*x4);
		var x = ( pre * (x3 - x4) - (x1 - x2) * post ) / d;
		var y = ( pre * (y3 - y4) - (y1 - y2) * post ) / d;
		
		// Check if the x and y coordinates are within both lines
		if ( x < Mathf.Min(x1, x2) || x > Mathf.Max(x1, x2) ||
		x < Mathf.Min(x3, x4) || x > Mathf.Max(x3, x4) ) return -1;
		if ( y < Mathf.Min(y1, y2) || y > Mathf.Max(y1, y2) ||
		y < Mathf.Min(y3, y4) || y > Mathf.Max(y3, y4) ) return -1;
		return y;
	}
}