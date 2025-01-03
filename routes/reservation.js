const express = require('express');
const Reservation = require('../models/Reservation');
const router = express.Router();

// ROUTE 1: get data: GET "/api/reservation/getdata". 
router.get('/getdata/:date/:time', async (req, res) => {
  const { date, time } = req.params;

  try {
    const reservation = await Reservation.findOne({ date, time });

    const tables = Array.from({ length: 16 }, (_, index) => ({
      tableNumber: index + 1,
      status: reservation && reservation.reservedTables.includes(index + 1) ? 'reserved' : 'available'
    }));

    res.json(tables);
  } 
  
  catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error fetching table availability' });
  }
});

// ROUTE 2: get data: POST "/api/reservation/reserve". 
router.post('/reserve', async (req, res) => {
  const { date, time, tableNumber } = req.body;

  try {
    let reservation = await Reservation.findOne({ date, time });

    if (!reservation) {
      reservation = new Reservation({ date, time, reservedTables: [tableNumber] });
    } else {
      if (reservation.reservedTables.includes(tableNumber)) {
        return res.status(400).json({ message: 'Table is already reserved' });
      }
      reservation.reservedTables.push(tableNumber);
    }

    await reservation.save();
    res.status(200).json({ message: 'Reservation successful', reservation });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error making the reservation' });
  }
});


// ROUTE 3: delete data: DELETE "/api/reservation/delete". 

router.delete('/delete', async (req, res) => {
  try {
    const { date, time, tableNumber } = req.body;

    if (!date || !time || !tableNumber) {
      return res.status(400).json({ message: 'Date, time, and table number are required' });
    }

    const reservation = await Reservation.findOne({ date, time });

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found for the given date and time' });
    }

    if (!reservation.reservedTables.includes(tableNumber)) {
      return res.status(404).json({ message: 'Table not found in the reservation' });
    }

    reservation.reservedTables = reservation.reservedTables.filter(table => table !== tableNumber);

    await reservation.save();

    res.status(200).json({ message: `Table ${tableNumber} reservation canceled successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



module.exports = router;

