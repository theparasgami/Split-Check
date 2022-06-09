import styled from 'styled-components';

export const Button=styled.button`
margin-top:1rem;
display: inline-block;
border-radius: 4px;
background-color:${props=>props.bgColor ||"rgb(73, 166, 191)" };
border: none;
color: #FFFFFF;
font-weight:bolder;
text-align: center;
font-size: 20px;
padding: 12px;
max-height:3rem;
max-width: 12rem;
min-width:6rem;
transition: all 0.5s;
cursor: pointer; 

span {
  cursor: pointer;
  display: inline-block;
  position: relative;
  transition: 0.5s;
 }
 
  span:after {
  content: '»';
  position: absolute;
  opacity: 0;
  top: 0;
  right: -15px;
  transition: 0.5s;
 }
 
 :hover span {
  padding-right: 15px;
 }
 
 :hover span:after {
  opacity: 1;
  right: 0;
 }

`
