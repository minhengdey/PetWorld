document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const calendarTitle = document.getElementById('calendarMonth');
    const calendarBody = document.getElementById('calendarBody');
    const timeSlotsContainer = document.getElementById('timeSlotsContainer');
    const selectedDateEl = document.getElementById('selectedDate');
    const timeSlotsGrid = document.getElementById('timeSlotsGrid');
    const todayBtn = document.querySelector('.today-btn');
    const prevMonthBtn = document.querySelector('.prev-month');
    const nextMonthBtn = document.querySelector('.next-month');
    const confirmBtn = document.querySelector('.confirm-btn');
    const currentTimeEl = document.getElementById('currentTime');

    // Date tracking
    const currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let selectedDay = null;
    let selectedTimeSlot = null;

    // Update current time display
    function updateCurrentTime() {
        const now = new Date();
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        };
        currentTimeEl.textContent = `Current time: ${now.toLocaleTimeString(undefined, options)}`;
    }

    // Update current time every second
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);

    // Update calendar title
    function updateCalendarTitle() {
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        calendarTitle.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    }

    // Generate calendar for the current month
    function generateCalendar() {
        // Clear calendar
        calendarBody.innerHTML = '';

        // Get the first day of the month
        const firstDay = new Date(currentYear, currentMonth, 1);
        // Get the last day of the month
        const lastDay = new Date(currentYear, currentMonth + 1, 0);

        // Get the day of the week for the first day (0 = Sunday)
        let startingDay = firstDay.getDay();

        // Get the total number of days in the month
        let monthDays = lastDay.getDate();

        // Get the last day of previous month
        const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();

        // Calculate rows needed
        const rows = Math.ceil((startingDay + monthDays) / 7);

        // Today's date
        const today = new Date();
        const todayDate = today.getDate();
        const todayMonth = today.getMonth();
        const todayYear = today.getFullYear();

        // Create calendar rows and cells
        let date = 1;
        for (let i = 0; i < rows; i++) {
            // Create row
            const row = document.createElement('tr');

            // Create cells
            for (let j = 0; j < 7; j++) {
                // Create cell
                const cell = document.createElement('td');
                const dayDiv = document.createElement('div');
                dayDiv.classList.add('day');

                // Fill in previous month days
                if (i === 0 && j < startingDay) {
                    const prevDate = prevMonthLastDay - startingDay + j + 1;
                    dayDiv.textContent = prevDate;
                    dayDiv.classList.add('other-month');

                    // Fill in next month days
                } else if (date > monthDays) {
                    dayDiv.textContent = date - monthDays;
                    dayDiv.classList.add('other-month');
                    date++;

                    // Fill in current month days
                } else {
                    dayDiv.textContent = date;

                    // Check if day is today
                    if (date === todayDate && currentMonth === todayMonth && currentYear === todayYear) {
                        dayDiv.classList.add('today');
                    }

                    // Check if day is in the past
                    const cellDate = new Date(currentYear, currentMonth, date);
                    if (cellDate < new Date(todayYear, todayMonth, todayDate)) {
                        dayDiv.classList.add('unavailable');
                    } else {
                        // Add click event for valid days
                        dayDiv.addEventListener('click', function() {
                            selectDay(date);
                        });
                    }

                    date++;
                }

                cell.appendChild(dayDiv);
                row.appendChild(cell);
            }

            calendarBody.appendChild(row);
        }
    }

    // Format date for display
    function formatDate(date) {
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }

    // Select a day
    function selectDay(day) {
        // Remove selected class from all days
        document.querySelectorAll('.day').forEach(d => {
            d.classList.remove('selected');
        });

        // Find and select the clicked day
        document.querySelectorAll('.day:not(.other-month)').forEach(d => {
            if (parseInt(d.textContent) === day) {
                d.classList.add('selected');
            }
        });

        selectedDay = day;

        // Update selected date display
        const selectedDateObj = new Date(currentYear, currentMonth, selectedDay);
        selectedDateEl.textContent = formatDate(selectedDateObj);

        generateCalendar();

        // Generate time slots
        generateTimeSlots(selectedDateObj);

        // Show time slots
        timeSlotsContainer.style.display = 'block';
    }

    // Generate time slots for selected day
    function generateTimeSlots(selectedDate) {
        // Clear time slots
        timeSlotsGrid.innerHTML = '';

        // Current time
        const now = new Date();
        const sameDay = selectedDate.getDate() === now.getDate() &&
            selectedDate.getMonth() === now.getMonth() &&
            selectedDate.getFullYear() === now.getFullYear();

        // Generate time slots (7AM to 9PM with 30min intervals)
        const startHour = 7; // 7AM
        const endHour = 21; // 9PM
        const interval = 30; // minutes

        for (let hour = startHour; hour <= endHour; hour++) {
            for (let min = 0; min < 60; min += interval) {
                // Skip times after 9PM
                if (hour === endHour && min > 0) continue;

                const timeSlot = document.createElement('div');
                timeSlot.classList.add('time-slot');

                const timeObj = new Date(selectedDate);
                timeObj.setHours(hour, min, 0);

                // Format the time
                const formattedTime = timeObj.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                });

                timeSlot.textContent = formattedTime;

                // Check if time is in the past (for today)
                if (sameDay && timeObj < now) {
                    timeSlot.classList.add('unavailable');
                } else {
                    timeSlot.addEventListener('click', function() {
                            selectTimeSlot(this);
                    });
                }

                timeSlotsGrid.appendChild(timeSlot);
            }
        }
    }

    // Select a time slot
    function selectTimeSlot(slot) {
        // Remove selected class from all time slots
        document.querySelectorAll('.time-slot').forEach(s => {
            s.classList.remove('selected');
        });

        // Add selected class to clicked time slot
        slot.classList.add('selected');
        selectedTimeSlot = slot.textContent;
    }

    // Go to today
    todayBtn.addEventListener('click', function() {
        const today = new Date();
        currentMonth = today.getMonth();
        currentYear = today.getFullYear();

        updateCalendarTitle();
        generateCalendar();

        // Hide time slots
        timeSlotsContainer.style.display = 'none';
        selectedDay = null;
        selectedTimeSlot = null;
    });

    // Previous month navigation
    prevMonthBtn.addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        updateCalendarTitle();
        generateCalendar();

        // Hide time slots
        timeSlotsContainer.style.display = 'none';
        selectedDay = null;
        selectedTimeSlot = null;
    });

    // Next month navigation
    nextMonthBtn.addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        updateCalendarTitle();
        generateCalendar();

        // Hide time slots
        timeSlotsContainer.style.display = 'none';
        selectedDay = null;
        selectedTimeSlot = null;
    });

    // Handle confirm button
    confirmBtn.addEventListener('click', function() {
        if (selectedDay && selectedTimeSlot) {
            const selectedDateObj = new Date(currentYear, currentMonth, selectedDay);
            const formattedDate = formatDate(selectedDateObj);
            alert(`You've selected: ${formattedDate} at ${selectedTimeSlot}`);

            // Return the selected date and time to the parent window or for further processing
            const selectedDateTimeISO = new Date(
                currentYear,
                currentMonth,
                selectedDay,
                ...parseTimeString(selectedTimeSlot)
            ).toISOString();

            console.log('Selected date and time:', selectedDateTimeISO);
            sessionStorage.setItem('dateTimeSelected', selectedDateTimeISO);
            history.back();

        } else if (!selectedDay) {
            alert('Please select a date first');
        } else {
            alert('Please select a time slot');
        }
    });

    // Helper function to parse time string like "10:30 AM" to [hours, minutes]
    function parseTimeString(timeStr) {
        const [time, period] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);

        if (period === 'PM' && hours !== 12) {
            hours += 12;
        } else if (period === 'AM' && hours === 12) {
            hours = 0;
        }

        return [hours, minutes];
    }

    // Initialize
    updateCalendarTitle();
    generateCalendar();
});