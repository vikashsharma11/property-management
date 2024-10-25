/* eslint-disable no-undef */
/* eslint-disable no-unused-vars*/
const express = require('express');
const shema = require('../models/User');

const getcustomer = async(req, res)=>{
    try {
        const items = await shema.find({});
        res.status(200).json(items)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

const addCustomer = async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const newCustomer = new shema({ name, email, password });
      await newCustomer.save();
      res.status(201).json(newCustomer);
    } catch (error) {
      res.status(500).json({ message: 'Error adding customer' });
    }
  };
  
  // Delete a customer
const deleteCustomer = async (req, res) => {
    try {
      await shema.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Customer deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Update a customer
  const updateCustomer = async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const updatedCustomer = await shema.findByIdAndUpdate(req.params.id, { name, email, password }, { new: true });
      res.status(200).json(updatedCustomer);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
module.exports = {
    getcustomer,
    addCustomer,
    deleteCustomer,
    updateCustomer

}
/* eslint-enable no-undef */
/* eslint-enable no-unused-vars */