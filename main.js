const carCanvas=document.getElementById("carCanvas");
carCanvas.width=200;//for the full window of the page

const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=300;


const carCtx = carCanvas.getContext("2d"); //for the drawing context
const networkCtx = networkCanvas.getContext("2d"); //for the drawing context


const road=new Road(carCanvas.width/2,carCanvas.width*0.9);

const N=1;
const cars = generateCars(N);//for the car number
let bestCar=cars[0];
if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){
        cars[i].brain=JSON.parse(
            localStorage.getItem("bestBrain"));
            if(i!=0){
                NeuralNetwork.mutate(cars[i].brain,0.2);
            }
    }
   
}


const traffic=[
    new Car (road.getLaneCenter(1),-100,30,50,"DUMMY",2,getRandomColor()),//for another car
    new Car (road.getLaneCenter(0),-300,30,50,"DUMMY",2,getRandomColor()),
    new Car (road.getLaneCenter(2),-300,30,50,"DUMMY",2,getRandomColor()),

    new Car (road.getLaneCenter(0),-500,30,50,"DUMMY",2,getRandomColor()),
    new Car (road.getLaneCenter(1),-500,30,50,"DUMMY",2,getRandomColor()),
    new Car (road.getLaneCenter(1),-700,30,50,"DUMMY",2,getRandomColor()),
    new Car (road.getLaneCenter(2),-700,30,50,"DUMMY",2,getRandomColor()),
    new Car (road.getLaneCenter(0),-900,30,50,"DUMMY",2,getRandomColor()),
    new Car (road.getLaneCenter(1),-900,30,50,"DUMMY",2,getRandomColor()),
    new Car (road.getLaneCenter(1),-1000,30,50,"DUMMY",2,getRandomColor())
];

animate();
function save(){
    localStorage.setItem("bestBrain",
    JSON.stringify(bestCar.brain));
}
function discard(){
    localStorage.removeItem("bestBrain");
}

function generateCars(N){
    const cars=[];
    for(let i=1; i<=N; i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"));
    }
    return cars;
}


function animate(time){
    for(let i=0; i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }
    for(let i=0;i<cars.length;i++){
        cars[i].update(road.borders,traffic);
    }

    bestCar=cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        ));
 

    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;


    carCtx.save();
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);//for centering the car

    road.draw(carCtx);//drawing the road using this context 
    for (let i=0; i<traffic.length; i++){
        traffic[i].draw(carCtx,"red");
    }


    carCtx.globalAlpha=0.2;
    for(let i=0;i<cars.length;i++){
    cars[i].draw(carCtx,"#1B2631");//drawing the car using this context 
    }
    carCtx.globalAlpha=1;
    bestCar.draw(carCtx,"blue",true);


    carCtx.restore();


    networkCtx.lineDashOffset=-time/50;//for visualization of the netwrok
    Visualizer.drawNetwork(networkCtx,bestCar.brain);
    requestAnimationFrame(animate);//calls the animate method again and again many times per second
}