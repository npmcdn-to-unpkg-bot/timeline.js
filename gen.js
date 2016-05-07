var persian = ['۰', '۱', '۲',  '۳',  '۴',  '۵',  '۶',  '۷',  '۸', '۹'];
function convertDigit(number) {
	return persian[number];
}

function convert(number) {
	number = "" + number;
	var result = "";
	for (var i = 0; i < number.length; i++) {
		result = result + convertDigit(eval(number[i]));
	}
	return result;
}

$( document ).ready(function() {
	$.getJSON('data.json', function( data ) {
		var gD = new Date();
		var jD = toJalaali(gD.getFullYear(), gD.getMonth()+1, gD.getDate());
		var jMonth = jD.jm;
		var jDay = jD.jd;

		$('#title').append($('<h1></h1>').text(data.title));
		var sprints = $('<table></table>').attr('cellspacing', 0);

		var colHeader = $('<colgroup></colgroup>');

		var months = data.season.months;
		var dayOfWeek = data.season.startsOnDayOfWeek;
		var weekend = data.season.weekend;

		colHeader.append($('<col/>'));
		for (var i=0; i<months.length; i++) {
			var month = months[i];
			for (var j=1; j<month.numOfDays+1; j++) {
				var col = $('<col/>').text(j);
				if (dayOfWeek % 7 == weekend || $.inArray(j, month.holidays) != -1) {
					col.addClass('offDay');
				}
				if (month.id == jMonth && j == jDay) {
					col.addClass('today');
				}
				colHeader.append(col);

				dayOfWeek++;

			}
		}
		sprints.append(colHeader);

		var monthNames = $('<tr></tr>').addClass('monthNames');
		var days = $('<tr></tr>').addClass('dayNumbers');

		monthNames.append($('<th></th>').text('ماه'));
		days.append($('<td></td>').text('روز'));

		for (var i=0; i<months.length; i++) {
			var month = months[i];

			var monthName = $('<th></th>').text(month.name).attr('colspan', month.numOfDays);
			if (month.id != 1) {
				monthName.addClass('firstDay');
			}
			monthNames.append(monthName);

			for (var j=1; j<=month.numOfDays; j++) {
				var day = $('<td></td>').text(convert(j)).addClass('vertical-text');
				if (month.id != 1 && j == 1) {
					day.addClass('firstDay');
				}
				days.append(day);
			}
		}

		sprints.append(monthNames);
		sprints.append(days);

		for (var i=0; i<data.teams.length; i++) {
			var team = data.teams[i];

			var sprintRow = $('<tr></tr>');
			var nameCell = $('<td></td>').text(team.name).addClass('vertical-text');
			nameCell.addClass('team-name');
			nameCell.attr('rowspan', Math.max(1, team.sprints.length));
			nameCell.attr('style', 'background-color: ' + team.color + ';');
			sprintRow.append(nameCell);
			//sprints.append(teamRow);

			for (var j=0; j<team.sprints.length; j++) {
				var planning = team.sprints[j].planning;
				var retrospective = team.sprints[j].retrospective;
				for (m = 0; m < months.length; m++) {
					monthId = months[m].id;
					for (day = 1; day <= months[m].numOfDays; day++) {
						var dayCol = $('<td></td>');
						if (monthId != 1 && day == 1) {
							dayCol.addClass('firstDay');
						}
						
						if ((planning.monthId == monthId && planning.day <= day
														|| planning.monthId < monthId)
								&& (retrospective == "infinity"
												|| retrospective.monthId == monthId
																&& retrospective.day >= day
												|| retrospective.monthId > monthId))
						{
							dayCol.attr('style', 'background-color: ' + team.color + ';');
							if (planning.monthId == monthId && planning.day == day) {
								dayCol.append($('<i></i>').addClass('fa fa-check-square-o'));
							}
							if (retrospective.monthId == monthId && retrospective.day == day) {
								dayCol.append($('<i></i>').addClass('fa fa-user-md'));
							}
						}
						sprintRow.append(dayCol);
					}
				}
				sprints.append(sprintRow);
				sprintRow = $('<tr></tr>');
			}
		}

		$('#sprints').append(sprints);
	});
});
