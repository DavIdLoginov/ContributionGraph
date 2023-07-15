import React, { useEffect, useState } from 'react';
import axios from 'axios';

const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const ContributionGraph = () => {
  const [startDate] = useState(new Date());
  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null); 
  const [selectedCount, setSelectedCount] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://dpg.gg/test/calendar.json');
      const contributionData = response.data;

      const formattedData = Object.entries(contributionData).map(([date, count]) => {
        return { date, count };
      });

      setData(formattedData);
    } catch (error) {
      console.log('Ошибка при получении данных:', error);
    }
  };

  const handleCountClick = (date, count) => {
    setSelectedDate(date);
    setSelectedCount(count);
  };

  const getColor = (count) => {
    if (count === 0) {
      return '#EDEDED';
    } else if (count >= 1 && count <= 9) {
      return '#ACD5F2';
    } else if (count >= 10 && count <= 19) {
      return '#7FA8C9';
    } else if (count >= 20 && count <= 29) {
      return '#527BA0';
    } else {
      return '#254E77';
    }
  };

  const renderWeeks = () => {
    
    const weeks = []

    for (let i = 0; i < 51; i++) {

      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() - 7 * (50 - i));

      const weekData = [];
      for (let j = 0; j < 7; j++) {
        const currentDay = new Date(currentDate);
        currentDay.setDate(currentDay.getDate() + j);

        const formattedDate = `${currentDay.getFullYear()}-${(currentDay.getMonth() + 1)
          .toString()
          .padStart(2, '0')}-${currentDay.getDate().toString().padStart(2, '0')}`;

        const contribution = data.find(item => item.date === formattedDate);
        const count = contribution ? contribution.count : 0;
        const color = getColor(count);

        weekData.push({ date: formattedDate, count, color });
      }

      weeks.push(weekData);
    }

    return weeks.map((weekData, index) => (
      <tr key={index}>
        <td style={{opacity: 0}}>{0}</td>
        {weekData.map(({ date, count, color }) => (
          <td
            key={date}
            onClick={() => handleCountClick(date, count)}
            style={{ backgroundColor: color }}
          ></td>
        ))}
      </tr>
    ));
  };

  return (
    <div className="contribution-graph">
      <table style={{ position: 'absolute', left: '600px', top: '-420px', transform: 'rotate(-90deg)' }}>
        <thead>
          <tr>
            <th></th>
            {daysOfWeek.map(day => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>{renderWeeks()}</tbody>
      </table>
      {selectedDate && (
              <div className="selected-info">
                <p>Дата: {selectedDate}</p>
                <p>Количество контрибьютеров: {selectedCount}</p>
              </div>
            )}
      <div style={{display: 'flex', marginLeft: '105px', position: 'absolute', top: '100px'}}>
        <p>Авг.</p>
        <p style={{marginLeft: '70px'}}>Сент.</p>
        <p style={{marginLeft: '60px'}}>Октяб.</p>
        <p style={{marginLeft: '65px'}}>Нояб.</p>
        <p style={{marginLeft: '70px'}}>Дек.</p>
        <p style={{marginLeft: '90px'}}>Янв.</p>
        <p style={{marginLeft: '80px'}}>Фев.</p>
        <p style={{marginLeft: '80px'}}>Март.</p>
        <p style={{marginLeft: '50px'}}>Апрель.</p>
        <p style={{marginLeft: '60px'}}>Май.</p>
        <p style={{marginLeft: '70px'}}>Июнь.</p>
        <p style={{marginLeft: '55px'}}>Июль.</p>
      </div>
    </div>
  );
};

export default ContributionGraph;
