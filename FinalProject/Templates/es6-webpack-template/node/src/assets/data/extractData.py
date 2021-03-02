#!/usr/bin/env python# -*- coding: utf-8 -*-
"""
Created on Mon Mar  1 16:20:38 2021

@author: carolina
"""

#extraxt 300 data randomely
import random


#geenerate 300 random numbers between 1 and 53941(length of diamonds.csv)
randomList = []
print(type(len(randomList)))

while len(randomList) < 300:
    number = randomList.append(random.randint(0,53941+1))
    if (number not in randomList) and (number != None):
        randomList.append(number)

randomList.sort()
print(randomList)



infile = open("diamonds.csv","r")
outfile = open("extractedData.csv","w")
header = infile.readline() #the header
outfile.write(header)

i = 0
count = 0
for line in infile:
    if i in randomList:
        outfile.write(line)
        count += 1
    i += 1
infile.close()
outfile.close()

print(len(randomList))
print(count)

