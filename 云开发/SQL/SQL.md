---
title: "SQL"
author: "凢凢"
date: "2019-08-12"
permalink: "SQL"
sidebar: "auto"
single: true
---

## 概述

##### 数据模型

- 层次模型 _树状结构_
- 网状模型 _节点相互连接_
- 关系模型 _表格结构_

关系模型占主导地位

#### 数据类型

- INT
- BIGINT
- REAL
- DOUBLE
- DECIMAL
- CHAR
- VARCHAR
- BOOLEAN
- DATE
- TIME
- DATETIME

SQL 是结构化查询语言的缩写，用来访问和操作数据库系统。

## 安装 mysql

[下载对应版本的 MySQL 压缩包](https://dev.mysql.com/downloads/mysql/)

作者用的是 windows 所以这里只记录 windows 的安装过程

```
# 配置环境变量，也可以不配置cd到bin目录执行

# 安装

mysqld -install

# 卸载

mysqld -remove

# 初始化

mysqld --initialize

# 等待一段时间之后,主目录下会生成一个data文件夹,其中err结尾的单文件内保存有初始root密码。

# 新建配置文件 my.ini

basedir=C:\Mysql\mysql-8.0.17-winx64    // 根目录
datadir=C:\Mysql\mysql-8.0.17-winx64\data // 数据存放目录
port=3306 // 端口号

# 启动服务

net start mysql

# MySQL服务已经启动成功

# 登录

mysql -u root -p

# 退出

quit
```

## 关系模型

关系数据库是建立在关系模型上，而关系模型本质就是若干个存储数据的二维表，可以简单理解为 Excel 表。

一条记录由多个字段组成，例如：

| id  | class_id | name | gender | score |
| --- | -------- | ---- | ------ | ----- |
| 1   | 1        | 小明 | M      | 90    |
| 2   | 1        | 小红 | F      | 95    |

###### 主键

主键类型:

1.  自增整数类型 (会有数值最大值限制)
2.  全局唯一 GUID 类型 (字符串没有最大值问题)

联合主键由多个字段组成唯一的标识记录，但尽量不要使用联合主键，会增加复杂度。

##### 外键

把数据与另一张表关联起来，这种列称为外键。

外键约束

```
ALTER TABLE students 指定关联的数据表
ADD CONSTRAINT fk_class_id 约束名称任意
FOREIGN KEY (class_id) 指定class_id为外键
REFERENCES classes (id); 关联的表的列名
```

删除外键

```
ALTER TABLE students  拥有外键的数据表
DROP FOREIGN KEY fk_class_id; 删除外键约束

DROP COLUMN ... 删除整列
```

约束会造成性能影响，通常情况下程序只依靠自身的逻辑来保证正确性，这种情况下，外键只单单是一个普通的列，而不是一个约定好的外键，但也同样能正确工作。

##### 索引

索引时关系数据库中对某一列或多个列的值进行预排序的数据结构，可以直接定位到符合条件的记录，加快查询速度。

```
ALTER TABLE students;  // 查询 students 表
ADD INDEX idx_score (score); // 查询表中的 score 列
ADD INDEX idx_name_score (name, score); // 查询多列
```

##### 唯一索引

与业务含义相关的字段都不能作为主键使用，但每个字段都具有唯一性。因为一条记录中不可能出现两条同样的身份证号。

假设 students 表的 name 不能重复

```
ALTER TABLE students
ADD UNIQUE INDEX uni_name (name);  // 添加一个唯一索引

ALTER TABLE students
ADD CONSTRAINI uni_name (name); // 添加唯一约束而不创建唯一索引
```

## 查询数据

`SELECT * FROM <表名>`

- SELECT 关键字表示执行一个查询操作
- \* 表示所有列
- FROM 表示从哪个表查询

`SELECT 100 + 200` 计算一个表达式，因此该关键字可以用于计算

##### 条件查询

SELECT 语句可以通过 WHERE 条件来设定查询条件。比如指定 分数高于 80 以上的学生

`SELECT * FROM students WHERE score >= 80`

WHERE 关键字后面的 score >= 80 就是条件，score 是列名，该列存储了学生的成绩。

因此条件查询的语法就是:

`SELECT * FROM <表名> WHERE <条件表达式>`

条件表达式可以用<条件 1> AND <条件 2> 表达满足条件 1 并且满足条件 2 。

分数在 80 且为男生

`SELECT * FROM students WHERE score >= 80 AND gender = 'M'`

AND/OR/NOT

常用的条件表达式:

- =
- \>
- \<
- <> 不相等
- LIKE name LIKE'ab%' %表示任意字符

**WHERE** 旨意在于筛选数据

##### 投影查询

`SELECT id, score, name FROM students;` 返回仅需要的列

`SELECT id, score points, name FROM students;` pints 是 score 的别名

`SELECT id, score points,name FROM students WHERE gender = 'M'`

##### 排序

-- 按照分数排序 从低到高

`SELECT id,name,gender,score FROM students ORDER BY score`;

-- 从高到低

`SELECT id,name,gender,score FROM students ORDER BY score DESC`

-- 进一步排序

`SELECT id,name,gender,score FROM students ORDER BY score DESC,gender;`

ASC 是升序，即从小到大

`SELECT id,name,gender,score FROM students WHERE class_id = 1 ORDER BY score DESC`;

##### 分页查询

先对数据进行从高到低处理

`SELECT id,name,gender,score FROM students ORDER BY score DESC`;

分页处理

`SELECT id,name,gender,score FROM students ORDER BY score DESC LIMIT 3 OFFSET 0`;

`SELECT id,name,gender,score FROM students ORDER BY score DESC LIMIT 3 OFFSET 3`;

`SELECT id,name,gender,score FROM students ORDER BY score DESC LIMIT 3 OFFSET 6`;

`SELECT id,name,gender,score FROM students ORDER BY score DESC LIMIT 3 OFFSET 9`;

LIMIT 表示最多 3 条记录，如果最后一页只有一条记录那么只将显示一条。

LIMIT 和 OFFSET 应该设定的值：

- LIMIT 总是设定为 pageSize
- OFFSET 计算公式为 paseSize \* (pageIndex - 1);

`LIMIT 15 OFFSET 30` 简写 `LIMIT 30,15` 页数 30，15 条数据。

##### 聚合查询

`SELECT COUNT(*) FROM stundents;`
`SELECT COUNT(*) num FROM stundents;` 别名
`SELECT COUNT(*) boys FROM stundents WHERE gender = 'M';` 多少男生?

SQL 提供的其他聚合函数:

| 函数 | 说明                                   |
| ---- | -------------------------------------- |
| SUM  | 计算某一列的合计值，该列必需为数值类型 |
| AVG  | 计算某一列的平均值，该列必需为数值类型 |
| MAX  | 计算某一列的最大值                     |
| MIN  | 计算某一列的最小值                     |

统计男生平均成绩
`SELECT AVG(score) average FROM students WHERE gender = 'M';`

每页数据为 3，获取数据的总页数
`SELECT CEILING(COUNT(*)/3) from students;`

分组聚合

通过班级计算所有学生数量

`SELECT COUNT(*) num FROM stundens GROUP BY class_id;`

新增一列

`SELECT class_id, COUNT(*) num FROM students GROUP BY class_id`

报错

`SELECT name,class_id,COUNT(*) num FROM students GROUP BY class_id;`

统计各班的男生和女生人数

`SELECT class_id,gender,COUNT(*) num FROM students GROUP BY class_id,gender;`

##### 多表查询

`SELECT * FROM <表1><表2>`

-- set alias;

```
SELECT
   s.id sid,
   s.name,
   s.gender,
   s.score,
   c.id cid,
   c.name cnmae
FROM students s,classes c;

// 添加WHERE条件

SELECT
   s.id sid,
   s.name,
   s.gender,
   s.score,
   c.id cid,
   c.name cnmae
FROM students s,classes c
WHERE s.gender = 'M' AND c.id = 1;  // 一班男同学
```

_多表查询性能消耗非常巨大_

##### 连接查询

连接查询是另一种类型的多表查询。连接查询对多个表进行 JOIN 运算。
先确定一个主表作为结果集，然后，把其他表的行有选择性地连接在主表结果集上。

`SELECT s.id,s.name,s.class_id,s.gender,s.score FROM students s;`

需求：添加班级名称，但班级名称这个字段在 classes 表中。

通过 class_id -> classes -> name

```
SELECT s.id,s.name,s.class_id,s.gender,s.score
FROM students s
INNER JOIN classes c
ON s.class_id = c.id
```

INNER JOIN 内连接,查询的写法是: 1.先确定主表，任使用 FROM <表 1>的语法; 2.再确定需要连接的表，使用 INNER JOIN <表 2>的语法； 3.然后确定连接条件，使用 ON <条件...>,这里的条件是 s.class_id = c.id,表示 students 表的 class_id 列与 classes 表的 id 列相同的行进行连接; 4.可选：加上 WHERE 子句、ORDER BY 等子句进行筛选和排序。

使用外连接

```
SELECT s.id,s.name,s.class_id,s.gender,s.score
FROM students s
RIGHT OUTER JOIN classes c
ON s.class_id = c.id;
```

有 RIGHT OUTER JOIN，就有 LEFT OUTER JOIN，以及 FULL OUTER JOIN。
INNER JOIN 只返回同时存在于两张表的行数据，因为 students 表的 class_id 包含 1,2,3 classes 表的 id 包含 1,2,3,4,所以，INNER JOIN 根据条件 s.class_id = c.id 返回的结果集仅包含 1,2,3。
RIGHT OUTER JOIN 返回右表都存在的行，如果一行仅在右表存在，那么结果集就会以 NULL 填充剩下的字段。
LEFT OUTER JOIN 则是返回左表都存在的行。
FULL OUTER JOIN 合并两张表的所有记录，并把对方不存在的字段填充为 null。

-- 总结

INNER JOIN 是两张表的集合

## 修改数据

关系数据库的基本操作就是增删改查，即 CRUD：Create/Retrieve/Update/Delete

SELECT 语句对应查询

##### INSERT

当我们向数据库表中插入一条新记录时，就必需使用 INSERT 语句。

INSERT 语句的基本语法：

`INSERT INTO <表名> (字段1，字段2,...) VALUES (值1,值2,...)`

```sql
-- 添加一条新纪录
INSET INTO students (class_id,name,gender,score) VALUES (2,'凡凡','M','100')

-- 查询结果
SELECT * FROM students;

-- 一次性添加多条记录
INSET INTO students (class_id,name,gender,score) VALUES
  (1,'大宝','M',88)
  (2,'桃子','F',99)
```

##### UPDATE

如果要更新数据库表中的记录，我们就必需用 UPDATE 语句。

UPDATE 语句的基本语法是：

`UPDATE <表名> SET 字段1=值1,字段2=值2, .... WHERE....;`

```sql
-- 更新id=1的记录
UPDATE students SET name="凡哥哥",score="100" WHERE id=1;

-- 查询并观察结果；
SELECT * FROM students WHERE id=1;

-- 更新多条记录
UPDATE students SET name="凡哥哥",score="100" WHERE id>=5 AND id<=7;

SELECT * FROMstudents WHERE id>=5 AND id<=7;

-- 使用表达式
UPDATE students SET score=score+10 WHERE score<80;
```

**UPDATE 语句可以没有 WHERE 条件，届时整个表的所有记录都会被给更新，所以在执行的时候应该给外小心，先通过 SELECT 筛选去符合预期的记录集，然后在用 UPDATE 执行更新。**

##### DELETE

DELETE 语句的基本语法是：
`DELETE FROM <表名> WHERE...`

```sql
-- 删除id为1的记录
DELETE FROM students WHERE id=1;

-- 删除多条记录
DELETE FROM students WHERE id>=5 AND id<=7; -- 删除了3条记录
```

**DELETE 不带 WHERE 同样会删除整张表记录。**

## MySQL

可单独安装 MySQL Client 连接远程 mysql 服务器
`mysql -h 10.0.1.99 -u root -p`

mysql 是客户端 mysqld 是服务端

##### 管理 MySQL

要管理 MySQL,可以使用可视化图形界面[MYSQL Workbench](https://dev.mysql.com/downloads/workbench/)

##### 数据库

一个运行 MySQL 的服务器上，实际上可以创建多个数据库 (Database)。

查看服务器上所有数据库
`mysql> SHOW DATABASES;`

创建新数据库

`mysql> CREATE DATABASE test;`

删除一个数据库

`mysql> DROP DATABASE test;`

对一个数据库操作时，要首先将其切换为当前数据库：

`mysql> USE test;`

##### 表

列出当前数据库的所有表

`mysql > SHOW TABLES;`

查看表的结构

`mysql > DESC students;`

查看创建表的 SQL 语句：

`mysql> SHOW CREATE TABLE students`;

删除表

`DROP TABLE students`

要修改 birth 列，例如把列名改为 birthday,类型改为 VARCHAR(20)

`ALTER TABLE students CHANGE CLOUMN birth birthday VARCHAR(20) NOT NULL;`

删除列

`ALTER TABLE students DROP COLUMN birthday`

退出

`exit`

##### 实用 SQL 语句

###### 插入或替换

`REPLACE INTO students (id,class_id,name,gender,score) VALUES (1,1,'小明','M',100);`

###### 插入或更新

`INSERT INTO students (id,class_id,name,gender,score) VALUES (1,1,'小明','F',99) ON DUPLICATE KEY UPDATE name = '小明',gender='F',score=90;`

###### 插入或忽略

`INSERT IGNORE INTO students (id,class_id,name,gender,score) VALUES (1,1,'小明','F',99)`

##### 快照

如果想要对一个表进行快照，即复制一份当前表的数据到一个新表，可以结合 CREATE TABLE 和 SELECT

`CREATE TABLE students_of_class1 SELECT * FROM students WHERE class_id = 1;`

##### 写入查询结果集

如果查询结果需要写入表中，可以结合 INSERT 和 SELECT ，将 SELECT 语句的结果集直接插入到指定表中。

```sql
CREATE TABLE statistics (
    id BEGIN NOT NULL AUTO_INCREMENT,
    class_id BEGIN NOT NULL,
    average DOUBLE NOT NULL,
    PRIMARY KEY (id)
);
```

写入各个班的平局分

`INSERT INTO statistics (class_id,average) SELECT class_id,AVG(score) FROM students GROUP BY class_id;`

```sql
> select * from statistics;
+----+----------+--------------+
| id | class_id | average      |
+----+----------+--------------+
|  1 |        1 |         86.5 |
|  2 |        2 | 73.666666666 |
|  3 |        3 | 88.333333333 |
+----+----------+--------------+
3 rows in set (0.00 sec)
```

## 事务

在执行 SQL 语句的时候，某些业务需求，一系列操作必须全部执行，而不能仅执行一部分。例如：一个转账操作：

```sql
-- 从 id1的账户给id2的账户转账100元
-- 第一步: 将id=1的A账户余额减去100元
UPDATE accounts SET balance = balance - 100 WHERE id=1;
-- 从二步：将id=2的B账户余额加上100元
UPDATE accounts SET balance = balance + 100 WHERE id=2;
-- 这两条语句必需全部执行，或者，由于某些原因，如果第一条语句成功，第二条语句失败，就必须全部撤销。
```

> 把多条语句作为一个整体进行操作的功能，被称为数据库事务。数据库事务可以确保该事务范围内的所有操作都可以全部成功或者全部失败，如果事务失败，那么效果就和没有执行这些 SQL 一样，不会对数据库数据有任何改动。

可见，数据库事物具有 ACID 这 4 个特征：

- A:Atomic 原子性，将所有 SQL 作为原子工作单元执行，要么全部执行，要么全部不执行；
- C:Consistent 一致性，事务完成后，所有数据的的状态都是一致的，即 A 账户只要减去了 100，B 账户则必须加上了 100；
- I:Isolation 隔离性，如果有多个事务并发执行，每个事务做出的修改必须与其他事务隔离；
- D:Duration 持久性，即事务完成后，对数据库的修改被持久化存储。

对于单条 SQL 语句，数据库系统自动将其作为一个事务执行，这种事务被称为隐式事务。

```sql
-- 将多条SQL语句作为一个事务执行
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
```

COMMIT 是提交事务，即试图把事务内的所有 SQL 所做的修改永久保存。如果 COMMIT 语句执行失败了，整个事务也会失败。

```sql
-- 事务主动失败
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
ROLLBACK;
```

## 隔离级别

> SQL 定义了四种隔离级别，分别对应可能出现数据不一致的情况：

##### Read Uncommitted

Read UNcommitted 是隔离级别最低一种事务级别。这种隔离级别下，一个事务会读到另一个事务更新后但未提交的数据，如果一个事务回滚，那么当前事务读到的数据就是脏数据。

```sql
-- 事务1

SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
BEGIN;
UPDATE students SET name='BOb' WHERE id=1;
ROLLBACK;

-- 事务2

SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
BEGIN;
SELECT * FROM students WHERE id=1;
SELECT * FROM students WHERE id=1;
COMMIT;
```

##### Read Committed

在 Read Committed 隔离级别下，一个事务可能会遇到不可重复读的问题。
不可重复读是指，在一个事务内，多次读同一数据，在这个事务还没结束时，如果另一个事务恰好修改了这个数据，那么，在第一个事务中，两次读取的数据可能不一致。

```sql
-- 事务1
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
BEGIN;

UPDATE students SET name = 'Bob' WHERE id = 1;
COMMIT;

-- 事务2
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
BEGIN;
SELECT * FROM students WHERE id = 1;


SELECT * FROM students WHERE id = 1;
COMMIT
```

##### Repeatable Read

在 Repeatable Read 隔离级别下，一个事务可能会遇到幻读（Phantom Read）的问题。

幻读是指，在一个事务中，第一次查询某条记录，发现没有，但是，试图更新这条不存在的记录时，竟然能成功，并且，再次读取同一条记录，它就神奇的出现了。

```sql
-- 事务1
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
BEGIN;

UPDATE students SET name = 'Bob' WHERE id = 1;
COMMIT;

-- 事务2
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
BEGIN;

INSERT INTO students (id, name) VALUES (99, 'Bob');
COMMIT

--事务2
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
BEGIN;
SELECT * FROM students WHERE id=99;


SELECT * FROM students WHERE id=99
UPDATE students SET name='Alice' WHERE id=99;
SELECT * FROM students WHERE id=99;
COMMIT;
```

##### Serializable

Serializable 是最严格的隔离级别。在 Serializable 隔离隔离级别下，所有事务会按照次序依次执行，因此，脏读，不可重复读，幻读都不会出现。

虽然 Serializable 隔离级别下的事务具有最高的安全性，但是，由于事务是串行执行，所以效率会大大下降，应用程序的性能会极具降低，如果没有特别重要的情景，一般都不会使用 Serializable 隔离级别。

##### 默认隔离级别

如果没有指定隔离级别，数据库就会使用默认隔离级别。在 MySQL 中，如果使用 InnoDB，默认的隔离级别是 Repeatable Read(幻读)。
