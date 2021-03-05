#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Thu Mar  4 22:09:18 2021

@author: carolina
"""


#convert non-numerical values into integers.
#Cut[Fair, Good, Very Good, Premium, Ideal]
#Price[continuous], Carat[continuous]
#Clarity[I1 (worst), SI2, SI1, VS2, VS1, VVS2, VVS1, IF (best)]
#color[D being the best and J the worst]


cut = {"\"Fair\"":"1", "\"Good\"":"2", "\"Very Good\"":"3", "\"Premium\"":"4", "\"Ideal\"":"5"}
color = {"\"D\"":"7","\"E\"":"6","\"F\"":"5","\"G\"":"4","\"H\"":"3","\"I\"":"2","\"J\"":"1"}
clarity = {"\"I1\"":"1", "\"SI2\"":"2", "\"SI1\"":"3", "\"VS2\"":"4", "\"VS1\"":"5", "\"VVS2\"":"6", "\"VVS1\"":"7", "\"IF\"":"8"}


infile = open("extractedData.csv","r")
outfile = open("convertedExtractedData.csv","w")
header = infile.readline() #the header
outfile.write(header)  #"","carat","cut","color","clarity","depth","table","price","x","y","z"
print(header)
print(cut)
print(color)
print(clarity)


for line in infile:
    
    readLine = line.strip()
    elements = readLine.split(",")
    
    convertedLineList = [elements[0], elements[1], cut[elements[2]], color[elements[3]], clarity[elements[4]]] + elements[5:]
    
    convertedLine = ""
    for i in range(len(convertedLineList)):
        convertedLine += convertedLineList[i] + ","
    convertedLine = convertedLine[:-1]

    outfile.write(convertedLine+"\n")


infile.close()
outfile.close()