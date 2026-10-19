/* Графіки екзаменаційних завдань. Формати ті самі, що в модулях 1–7: x+series (лінія), pies, bars, tab, img. */
(function () {
  var C = { blue: '#2E5A88', orange: '#E8890C', green: '#4A7C59', pink: '#C94F7C', dark: '#4A4F44', purple: '#7A5AA0' };
  function pies(cats, sets) { return sets.map(function (st) { return { label: st.label, slices: cats.map(function (c, i) { return { name: c[0], color: c[1], value: st.v[i] }; }) }; }); }
  window.GRAPHS = {
    line: { title: 'Annual Sales of Three Types of Bicycle (thousands, 2005–2025)', svgTitle: 'Annual sales of three types of bicycle in one country (thousands)',
      yLabel: 'sales (thousands)', x: ['2005', '2010', '2015', '2020', '2025'], yMax: 160, step: 40,
      series: [{ name: 'Road bikes', color: C.dark, values: [90, 95, 80, 70, 60] }, { name: 'Electric bikes', color: C.orange, values: [5, 12, 40, 85, 150] }, { name: 'Mountain bikes', color: C.green, values: [60, 75, 85, 70, 55] }] },

    pie: { title: 'Household Spending in One Country, 1994 and 2024', svgTitle: 'How a typical household spent its money, 1994 and 2024',
      pies: pies([['Housing', C.blue], ['Food', C.orange], ['Transport', C.green], ['Leisure', C.pink], ['Other', C.dark]],
        [{ label: '1994', v: [30, 25, 15, 10, 20] }, { label: '2024', v: [38, 15, 17, 16, 14] }]) },

    bar: { title: 'Employees Working from Home at Least One Day a Week, 2019 and 2024', svgTitle: 'Employees working from home at least one day a week (%)',
      bars: { yLabel: '% of employees', max: 50, step: 10, suffix: '%', cats: ['UK', 'Germany', 'Spain', 'Poland', 'Sweden'],
        series: [{ name: '2019', color: C.blue, values: [12, 10, 6, 5, 16] }, { name: '2024', color: C.orange, values: [38, 31, 24, 18, 45] }] } },

    table: { title: 'Average Number of Books Read per Person per Year, 2000, 2010 and 2020',
      tab: { corner: 'Country', cols: ['2000', '2010', '2020'], pre: '', suffix: '',
        rows: [['Finland', 14, 15, 13], ['Japan', 9, 10, 11], ['Brazil', 4, 5, 7], ['Italy', 6, 5, 4], ['Canada', 11, 12, 12]] } },

    process: { title: 'How glass bottles are recycled', img: '../assets/process.png', alt: 'Схема процесу переробки скляних пляшок у 8 етапів: збір, транспортування, сортування, подрібнення, очищення, плавлення, формування, розподіл.' },
    maps: { title: 'Hillfield College campus, 1995 and 2025', img: '../assets/maps.png', alt: 'Дві карти кампусу Hillfield College: 1995 і 2025.' },

    mixBar: { title: 'Household Waste Recycled in Five UK Cities, 2024', svgTitle: 'Household waste recycled in five UK cities, 2024',
      bars: { yLabel: '% of household waste', max: 80, step: 20, suffix: '%', cats: ['Leeds', 'Bristol', 'Cardiff', 'Glasgow', 'Norwich'],
        series: [{ name: 'Waste recycled', color: C.green, values: [46, 58, 62, 41, 54] }] } },
    mixTab: { title: 'Household Waste per Person (kg per year), 2010 and 2024',
      tab: { corner: 'City', cols: ['2010', '2024'], pre: '', suffix: '',
        rows: [['Leeds', 410, 385], ['Bristol', 395, 360], ['Cardiff', 380, 330], ['Glasgow', 430, 415], ['Norwich', 400, 372]] } }
  };
})();
