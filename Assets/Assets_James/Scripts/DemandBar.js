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
	
	function DemandBar(pPos : Vector2, pWidth : int, pHeight : int) {

		mPosition		=	pPos;
		mWidth			=	pWidth;
		mHeight			=	pHeight;
		mLastMoved		=	0;
		mPointsToShow	=	10;
		mCurTime		=	0;
		mScale			=	pHeight/100;
		mPowerLvl		= 	0;
		
		LoadDataFromFile();
	
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
		
		GUI.BeginGroup(Rect (mPosition.x-50, Screen.height-mPosition.y-mHeight-50, mWidth+100, mHeight+100));	
			GUI.Box(Rect (50, 30, mWidth, mHeight+20), "Energy Demand");
			GUI.Label(Rect (30, mHeight+35, 50, 50), "0%");
			GUI.Label(Rect (18, 45, 50, 50), "100%");
			GUI.Label(Rect (50, mHeight+50, 50, 50), "12AM");
			GUI.Label(Rect (mWidth+20, mHeight+50, 50, 50), "12PM");
			GUI.Label(Rect(mCurTime+50+(6*mScale), mHeight+50-mPowerLvl-10, 50, 50), ""+(mPowerLvl/mScale)+"%");
		GUI.EndGroup();
		
		// Update graph based on time passed
		mLastMoved += pDeltaTime;
		if(mLastMoved >= 1) {
			if(mPosition.x+mCurTime < mPosition.x+mWidth) {
				mCurTime += mWidth/(60);
			}
			mLastMoved = 0;
		}
	}
	
	/*
	*	Draws the energy demand graph
	*/
	function DrawGraph(pPlayerPower : float)
	{
		mPowerLvl = pPlayerPower*mScale;
		mLineMaterial.SetPass(0);
		GL.LoadPixelMatrix();
		
		// Draw graph
		GL.Color( Color(1.0f, 1.0f, 1.0f, 1) );
		GL.Begin( GL.LINES);
			GL.Vertex(mPosition);
			GL.Vertex(Vector2(mPosition.x, mPosition.y+mHeight));
			GL.Vertex(Vector2(mPosition.x+mWidth, mPosition.y));
			GL.Vertex(mPosition);
			
			// Draw current time marker
			GL.Color( Color(1.0f, 1.0f, 0.0f, 1) );
			GL.Vertex(Vector2(mPosition.x+(mCurTime), mPosition.y));
			GL.Vertex(Vector2(mPosition.x+(mCurTime), mPosition.y+mHeight));
			
			// Draw current power output marker
			GL.Color( Color(0.1f, 1.0f, 0.1f, 1) );
			var radius 	= 	5*mScale;
			var sides 	= 	20;
			for (var j = 0; j < 20; j++)
		    {		
				GL.Vertex(Vector2((radius * Mathf.Cos(j * (2 * Mathf.PI) / sides)) + mPosition.x+mCurTime , (radius * Mathf.Sin(j * (2 * Mathf.PI) / sides)) + mPosition.y+mPowerLvl));
		    }

			// Draw points
			GL.Color( Color(1.0f, 0.1f, 0.1f, 1) );
			for(var i = 0; i < mPointsToShow; i++) {
				GL.Vertex(mPoints[i]);
				GL.Vertex(mPoints[i+1]);
			}
		GL.End();
	}
	
	/*
	*	Checks if the players current power output is greater then the current demand
	*	and returns the result.
	*/
	function IsAboveDemand() {
	
		var point : int = -1;
		var pointFound : boolean = false;

		for(var i = 0; i < mPoints.Length-1; i++) {
			if(mPoints[i].x < (mPosition.x+mCurTime) && mPoints[i+1].x > (mPosition.x+mCurTime)) {
				point = i;
				pointFound = true;		
			}
		}
		if(point != -1) {
			var demand : float = Intersection(mPoints[point], mPoints[point+1], Vector2(mPosition.x+(mCurTime), mPosition.y), Vector2(mPosition.x+(mCurTime), mPosition.y+mHeight));
			if(mPowerLvl > demand) {
				return true;
			}
		}
		return false;
	}
	
	/*
	*	Loads the graph data from a .txt file
	*/
	private function LoadDataFromFile() {
	
		var sr = new StreamReader(Application.dataPath + "/" + "GraphData.txt");
	    var fileContents = sr.ReadToEnd();
	    sr.Close();
	 
	    var lines = fileContents.Split("\n"[0]);
	    mPoints = new Vector2[lines.Length];
	    var pointCount = 0;
	    for (line in lines) {
	    	mPoints[pointCount] = (Vector2(mPosition.x+(pointCount*(mWidth/mPointsToShow)), (parseInt(line)*mScale)+mPosition.y));
	    	pointCount++;
	    }
	}
	
	/*
	*	Checks for an intersection between two lines and returns the y value of the result.
	*	Used to find the energy demand at the current time.
	*/
	private function Intersection(p1 : Vector2, p2 : Vector2, p3 : Vector2, p4 : Vector2) {
		
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
			return null;
		}
		// Get the x and y
		var pre = (x1*y2 - y1*x2);
		var post = (x3*y4 - y3*x4);
		var x = ( pre * (x3 - x4) - (x1 - x2) * post ) / d;
		var y = ( pre * (y3 - y4) - (y1 - y2) * post ) / d;
		
		// Check if the x and y coordinates are within both lines
		if ( x < Mathf.Min(x1, x2) || x > Mathf.Max(x1, x2) ||
		x < Mathf.Min(x3, x4) || x > Mathf.Max(x3, x4) ) return null;
		if ( y < Mathf.Min(y1, y2) || y > Mathf.Max(y1, y2) ||
		y < Mathf.Min(y3, y4) || y > Mathf.Max(y3, y4) ) return null;
		Debug.Log(y);
		return y;
	}
}