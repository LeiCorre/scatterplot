import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import * as d3 from 'd3';
import { timeFormat } from 'd3';

// used answer from https://stackoverflow.com/questions/27530462/tag-error-react-jsx-style-tag-error-on-render by Sebastian to show me how to place CSS styling directly in App.js
const css = `
body {
  background-color: lightGray;
}
a {
  font-size: 12px;
}
#tooltip {
  background-color: rgb(151, 224, 148, 0.7);
  box-shadow: 0 0 5px 3px rgb(15, 15, 15, 0.8);
  font-size: 11px;
  float: right;
  min-height: 30px;
  text-align: left;
  border-radius: 10px;
  min-width: 150px;
  text-align: center;
  padding: 10px;
  z-index: 999;
  position: absolute;
  top: 90px; }

  svg {
    margin-top: -60px;
    margin-bottom: -60px;
  }

  #foot {
    font-size: 14px;
    font-weight: 700;
    text-align: center;
  }

`

const req = new XMLHttpRequest();
    req.open("GET", 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json', true)
    req.send()
    req.onload = function() {
      let json = JSON.parse(req.responseText);
  
      const w = 990;
      const h = 600;
      const p = 100;

      
      d3.select('.App').append('h1').text("Professional Cyclists and Times, Doping vs Not").attr('id', 'title') 
     
      
        
      const xScale = d3.scaleTime()
                       .domain([new Date(1994, 1 ,1), new Date(d3.max(json, (d) => d['Year']),1,1) ])
                       .range([p, w-p])
                       .clamp(true)
                       .nice();

     

      const yScale = d3.scaleTime() //passing a string into the date object was the idea I got from https://forum.freecodecamp.org/t/d3-difficulty-getting-the-y-axis-to-show-time/261140
                       .domain([(new Date('Saturday June 30, 2020 12:' + d3.max(json, (d) =>  d['Time']) )), (new Date('Saturday June 30, 2020 12:' + d3.min(json, (d) =>  d['Time']))) ])
                       .range([h-p, p]);             
                           

      const svg = d3.select('.App')
                    .append('svg')
                    .attr('height', h)
                    .attr('width', w);

  let box = d3.select('.App').append('div').text('hello').attr('id', 'tooltip').style('display', 'none'); //inspired by the last answer on this post (https://www.freecodecamp.org/forum/t/d3-tooltip-wanted-is-that-15-chars-now/92398/6)    
  
 
      svg.selectAll('circle')
         .data(json) 
         .enter()    
         .append('circle')
         .attr('cx', (d) => (xScale(new Date('January 1,'+d['Year']))) )
         .attr('cy', (d) => h-(h-yScale(new Date('Saturday June 30, 2020 12:'+d['Time']) )-p)-p)  
         .attr('r', 6)
         .attr('class', 'dot')
         .attr('data-xvalue', (d) => d['Year'])
         .attr('data-yvalue', (d) => new Date('Saturday June 30, 2020 12:'+d['Time']))
         .attr('nom', (d) => d['Name'])
         .attr('time', (d) => d["Time"])
         .attr('drugs', (d)=> d['Doping'])
         .attr('country', (d) => d['Nationality'])
         .style('fill', function(d) { if (d['Doping'].length===0) {return 'purple'} else {return 'green'}})
         .style('stroke', 'black')
         .style('stroke-width', '1')
         .on('mouseover', function() {
          box = box.attr('data-year', this.getAttribute('data-xvalue')) 
                   .style('display', 'inline')
                   .style('transform', (i) => "translate(" + (this.getAttribute('cx') - w ) + "px" + "," + (this.getAttribute('cy') - 50) + "px)")
                   .html((e) => '<div style="text-align:left;">Name: ' + this.getAttribute('nom')+ ', ' + this.getAttribute('country') + '</div>' + '<div style="text-align:left;">' + 'Year: ' + this.getAttribute('data-xvalue') + ', Time: ' + this.getAttribute('time') + '</div>' + '<div style="text-align:left;width:250px;">' + this.getAttribute('drugs') + '</div>')
                   })
                            
        .on('mouseout', function () {
          box = box.style('display', 'none')
        });
        // I picked up adding the text anchor to the text label for the axis from here https://stackoverflow.com/questions/11189284/d3-axis-labeling 
        svg.append('text').text("Time in Minutes").attr('text-anchor', 'end').attr('x', '-100').attr('y', 50).style('transform', 'rotate(270deg) ').style('font-size', '12px').style('font-weight', '700') 
        

        const xA = d3.axisBottom(xScale)
 
        const yA = d3.axisLeft(yScale)
                     .ticks(10)
                     .tickFormat(timeFormat("%M:%S"))
           
         svg.append('g')
            .attr('transform', "translate(0," + (h-p) + ")")
            .attr('id', 'x-axis')
            .call(xA)
     
        svg.append('g') 
            .attr('transform', "translate(" + p + ",0)")  
            .attr('id', 'y-axis')
            .call(yA) 
    

            svg.append('foreignObject')
            // I picked up the use of foreignObject to append a div to an svg from here https://bl.ocks.org/Jverma/2385cb7794d18c51e3ab
            .attr('width', 200)
            .attr('height', 50)
            .attr('x', 780)
            .attr('y', 380)
            
            .attr('id', 'legend')
            .style('text-align', 'left')
            .style('font-size', '12px')
            .style('font-weight', '700')            
            .html(`<div syle='text-align:left;'><div id='b1' style="background-color:green;height:18px;width:18px;display:inline-block;">&nbsp;&nbsp;&nbsp;</div> Doping<br> <div id='b2' style="background-color:purple;height:18px;width:18px;display:inline-block;">&nbsp;</div> Not Doping</div>`)
              
    d3.select('body').append('div').attr('id', 'foot').text('Coded by LeiCorre w/ code Refs at top')
    }

function App() {
  return (
    <div class="App">

     <style>{css}</style> 
    <a href="https://bl.ocks.org/Jverma/2385cb7794d18c51e3ab">Using foreignObject</a>&nbsp;|&nbsp;
    <a href="https://stackoverflow.com/questions/11189284/d3-axis-labeling">Using Anchortext</a>&nbsp;|&nbsp;
    <a href="https://forum.freecodecamp.org/t/d3-difficulty-getting-the-y-axis-to-show-time/261140">Passing the Time object a string</a>&nbsp;|&nbsp;
    <a href='https://www.freecodecamp.org/forum/t/d3-tooltip-wanted-is-that-15-chars-now/92398/6'>Tooltip Reference</a>
    <a href='https://stackoverflow.com/questions/27530462/tag-error-react-jsx-style-tag-error-on-render'>Inline CSS Styling</a>
    </div>
  );

}
ReactDOM.render(<App />, document.getElementById('root'))
export default App;
