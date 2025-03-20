<!DOCTYPE html>
<html lang="ru">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title }}</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 10px;
            border-bottom: 2px solid #4a6cf7;
        }

        .header h1 {
            color: #4a6cf7;
            margin-bottom: 5px;
            font-size: 24px;
        }

        .header p {
            color: #666;
            margin-top: 0;
            font-size: 14px;
        }

        .section {
            margin-bottom: 30px;
        }

        .section h2 {
            color: #4a6cf7;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
            font-size: 18px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        table,
        th,
        td {
            border: 1px solid #ddd;
        }

        th {
            background-color: #f5f5f5;
            padding: 10px;
            text-align: left;
            font-size: 14px;
        }

        td {
            padding: 8px 10px;
            font-size: 13px;
        }

        .summary-box {
            background-color: #f9f9f9;
            border: 1px solid #eee;
            border-radius: 5px;
            padding: 15px;
            margin-bottom: 20px;
        }

        .summary-item {
            display: inline-block;
            width: 30%;
            margin-right: 3%;
            text-align: center;
            vertical-align: top;
        }

        .summary-item h3 {
            margin-bottom: 5px;
            font-size: 16px;
            color: #555;
        }

        .summary-item p {
            margin-top: 0;
            font-size: 20px;
            font-weight: bold;
            color: #4a6cf7;
        }

        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 12px;
            color: #999;
            border-top: 1px solid #eee;
            padding-top: 10px;
        }

        .text-center {
            text-align: center;
        }

        .text-right {
            text-align: right;
        }

        .page-break {
            page-break-after: always;
        }

        .chart-container {
            margin: 20px 0;
            height: 200px;
        }
    </style>
</head>

<body>
    <div class="header">
        <h1>{{ $title }}</h1>
        <p>Дата формирования: {{ $generated_at }}</p>
    </div>

    <div class="section">
        <h2>Общая статистика</h2>
        <div class="summary-box">
            <div class="summary-item">
                <h3>Всего файлов</h3>
                <p>{{ $total_files }}</p>
            </div>
            <div class="summary-item">
                <h3>Общий размер</h3>
                <p>{{ $total_size }}</p>
            </div>
            <div class="summary-item">
                <h3>Средний размер</h3>
                <p>{{ $avg_file_size }}</p>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>Распределение по типам файлов</h2>
        <table>
            <thead>
                <tr>
                    <th>Расширение</th>
                    <th>Количество</th>
                    <th>Общий размер</th>
                    <th>% от общего</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($extensions as $ext)
                    <tr>
                        <td>{{ $ext->extension }}</td>
                        <td>{{ $ext->count }}</td>
                        <td>{{ $ext->formatted_size }}</td>
                        <td>{{ round(($ext->count / $total_files) * 100, 1) }}%</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="section">
        <h2>Недавние загрузки</h2>
        <table>
            <thead>
                <tr>
                    <th>Имя файла</th>
                    <th>Расширение</th>
                    <th>Размер</th>
                    <th>Пользователь</th>
                    <th>Дата загрузки</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($recent_uploads as $file)
                    <tr>
                        <td>{{ $file['name'] }}</td>
                        <td>{{ $file['extension'] }}</td>
                        <td>{{ $file['size'] }}</td>
                        <td>{{ $file['user'] }}</td>
                        <td>{{ $file['created_at'] }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="page-break"></div>

    <div class="section">
        <h2>Активность {{ $period }}</h2>
        <table>
            <thead>
                <tr>
                    <th>Дата</th>
                    <th>Количество загрузок</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($activity as $day)
                    <tr>
                        <td>{{ $day->formatted_date }}</td>
                        <td>{{ $day->count }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="footer">
        <p>Отчет сгенерирован автоматически системой облачного хранилища.</p>
        <p>© {{ date('Y') }} Все права защищены.</p>
    </div>
</body>

</html>
