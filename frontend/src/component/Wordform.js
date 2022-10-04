import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import classes from '../css/dumb.module.css'
import Qs from 'qs'
const WordForm = () => {
  // console.log(process.env.REACT_APP_ADDRESS);
  const newEnglish = useRef();
  const newChinese = useRef();
  const newClasses = useRef();
  const newCP = useRef();
  //当前页数
  const [currentPage, setCurrentPage] = useState(1);
  //每页最多显示的单词个数
  const [pageSize, setPageSize] = useState(10);
  //当前显示的单词数据
  const [Word_DATA, setWord_DATA] = useState([]);
  //单词总数
  const [totalNum, setTotalNum] = useState(0);
  const [changeData, setChangeData] = useState(false);
  const [settingCP, setSettingCP] = useState(false);
  const [needF5, setneedF5] = useState(false);
  const [addWord, setAddWord] = useState(false);
  const [hideEng, setHideEng] = useState(false);
  const [hideChi, setHideChi] = useState(false);
  //获取单词表
  const getWordData = (CP) => {
    fetch('http://localhost:3000/words?' + Qs.stringify({
      currentPage: CP,
      pageSize: pageSize
    }))
      .then(res => res.json())
      .then(data => {
        setWord_DATA(
          data.words.map(item => {
            return {
              ...item,
              hideMyChi: false,
              hideMyEng: false,
              changing: false,
              isDeleted: false
            }
          })
        );
        setTotalNum(data.pagination.total);
      })
      .catch(err => console.log(err));
  }
  useLayoutEffect(() => {
    getWordData(currentPage);
  }, [changeData]);
  const showOrHideENG = () => {
    setHideEng(preState => !preState);
    setWord_DATA(preState => {
      return preState.map(item => {
        return {
          ...item,
          hideMyEng: !hideEng
        }
      })
    });
  }
  const showOrHideCHI = () => {
    setHideChi(preState => !preState);
    setWord_DATA(preState => {
      return preState.map(item => {
        return {
          ...item,
          hideMyChi: !hideChi
        }
      })
    });
  }
  const addButtonEvent = () => {
    setAddWord(preState => !preState);
    setChangeData(preState => !preState);
  }
  //发送添加单词请求
  const sendAddReq = () => {
    fetch('http://localhost:3000/words', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        english: newEnglish.current.value,
        chinese: newChinese.current.value,
        classes: newClasses.current.value,
        click_time: 0
      })
    }).then(res => res.json())
      .catch(err => console.log(err));
    [newEnglish.current.value,
    newChinese.current.value,
    newClasses.current.value] = ['', '', ''];
    setCurrentPage(Math.ceil(totalNum / pageSize));
    setTimeout(getWordData, 500, Math.ceil(totalNum / pageSize));
  }
  //发送删除单词请求
  const sendDelReq = (id) => {
    const checkdel = window.confirm('确定要删除这个单词吗？');
    if (checkdel) {
      fetch('http://localhost:3000/words/' + id, {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())
        .catch(err => console.log(err));
    }
  }
  //发送修改单词请求
  const sendUpdReq = (Obj) => {
    const checkupd = window.confirm('确定更新单词数据？');
    if (checkupd) {
      fetch('http://localhost:3000/words/' + Obj.id, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          english: Obj.english,
          chinese: Obj.chinese,
          classes: Obj.classes,
          click_time: Obj.click_time
        })
      })
    }
  }
  //发送增加标记数请求
  const upclick_time = (Obj) => {
    fetch('http://localhost:3000/words/' + Obj.id, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        click_time: +Obj.click_time + 1
      })
    });
  }
  return <div>
    <header>
      {addWord ?
        <button onClick={addButtonEvent}>隐藏添加单词表格</button> :
        <button onClick={addButtonEvent}>显示添加单词表格</button>}
      {hideEng ? <button onClick={showOrHideENG}>显示英文单词</button> : <button onClick={showOrHideENG}>隐藏英文单词</button>}
      {hideChi ? <button onClick={showOrHideCHI}>显示中文意思</button> : <button onClick={showOrHideCHI}>隐藏中文意思</button>}
    </header>
    <table className={classes.mytable}>

      <caption>所有已添加的单词</caption>

      <thead>
        <tr>
          <th>英语单词</th>
          <th>中文意思</th>
          <th>词性</th>
          <th>添加日期/修改日期</th>
          <th>标记次数</th>
          <th>操作</th>
        </tr>
      </thead>

      <tbody>
        {addWord &&
          <tr >
            <td><input className={classes.myinput}
              id='english'
              ref={newEnglish}
              placeholder='请输入单词' /></td>
            <td><input className={classes.myinput}
              id='chinese'
              ref={newChinese}
              placeholder='请输入翻译' /></td>
            <td>
              <select id='classes' ref={newClasses}>
                <option>n.</option>
                <option>pron.</option>
                <option>prep.</option>
                <option>conj.</option>
                <option>v.</option>
                <option>adj.</option>
                <option>adv.</option>
              </select>
            </td>
            <td></td>
            <td></td>
            <td>
              <button onClick={sendAddReq}>点击添加单词</button>
            </td>
          </tr>}
        {Word_DATA.map(item => {
          return <tr>
            {!item.changing && !item.isDeleted && <>
              {!hideEng ?
                <td onClick={() => {
                  item.hideMyEng = !item.hideMyEng;
                  setneedF5(preState => !preState)
                }}>
                  {!item.hideMyEng && item.english}
                </td> : <td></td>}
              {!hideChi ?
                <td onClick={() => {
                  item.hideMyChi = !item.hideMyChi;
                  setneedF5(preState => !preState)
                }}>
                  {!item.hideMyChi && item.chinese}
                </td> : <td></td>}
              <td>{item.classes}</td>
              <td>{item.createdAt}</td>
              <td>{item.click_time}</td>
              <td>
                <button onClick={() => {
                  upclick_time(item);
                  getWordData(currentPage);
                  item.click_time = item.click_time + 1;
                  setneedF5(preState => !preState)
                }}>标记</button>
                {!item.changing &&
                  <button onClick={() => {
                    item.changing = true;
                    setneedF5(preState => !preState)
                  }}>修改</button>
                }
                {!item.changing &&
                  <button onClick={() => {
                    sendDelReq(item.id);
                    item.isDeleted = true;
                    setneedF5(preState => !preState)
                  }}>删除</button>
                }
              </td>
            </>}
            {
              item.changing &&
              <>
                <td><input className={classes.myinput}
                  value={item.english}
                  onChange={(e) => {
                    item.english = e.target.value;
                    setneedF5(preState => !preState)
                  }}
                /></td>
                <td><input className={classes.myinput}
                  value={item.chinese}
                  onChange={(e) => {
                    item.chinese = e.target.value;
                    setneedF5(preState => !preState)
                  }}
                /></td>
                <td>
                  <select value={item.classes}
                    onChange={(e) => {
                      item.classes = e.target.value;
                      setneedF5(preState => !preState)
                    }}
                  >
                    <option>n.</option>
                    <option>pron.</option>
                    <option>prep.</option>
                    <option>conj.</option>
                    <option>v.</option>
                    <option>adj.</option>
                    <option>adv.</option>
                  </select>
                </td>
                <td>{item.createdAt}</td>
                <td><input className={classes.myinput}
                  value={item.click_time}
                  onChange={(e) => {
                    item.click_time = e.target.value;
                    setneedF5(preState => !preState)
                  }}
                /></td>
                <td>
                  <button onClick={() => {
                    sendUpdReq(item);
                    item.changing = false;
                    setneedF5(preState => !preState)
                  }}>提交</button>
                  <button onClick={() => {
                    item.changing = false;
                    setneedF5(preState => !preState)
                    setChangeData(preState => !preState);
                  }}>取消</button>
                </td>
              </>
            }
            {
              item.isDeleted && <td colSpan={6}>数据已删除</td>
            }
          </tr>
        })}

      </tbody>

    </table>
    <footer>
      <div>
        {settingCP && <input className={classes.pageinput}
          ref={newCP} />}
      </div>
      {currentPage !== 1 && <button onClick={() => {
        getWordData(currentPage - 1);
        setCurrentPage(preState => preState - 1);
        newCP.current.value = currentPage - 1;
        //redux不是同步的，这个域内的currentPage不会因set改变
      }}>上一页</button>}
      {currentPage !== Math.ceil(totalNum / pageSize) && <button onClick={() => {
        //redux不是同步的，这个域内的currentPage不会因set改变
        getWordData(1 + +currentPage);
        setCurrentPage(preState => 1 + +preState);
        newCP.current.value = 1 + +currentPage;
      }}>下一页</button>}

      <div>
        {settingCP && <button onClick={() => {
          if (newCP.current.value > Math.ceil(totalNum / pageSize)) {
            alert('超过最大页数，已跳转至最后一页');
            setCurrentPage(Math.ceil(totalNum / pageSize));
            getWordData(Math.ceil(totalNum / pageSize));
            newCP.current.value = Math.ceil(totalNum / pageSize);
          }
          else {
            setCurrentPage(+newCP.current.value);
            getWordData(+newCP.current.value);
          }
        }}>设置</button>}
      </div>
      <div>
        <button onClick={() => {
          setSettingCP(preState => !preState);
        }}>{settingCP ? '取消' : '设置页码'}</button>
      </div>
      <div>
        每页最多显示{pageSize}个单词
      </div>
      <div>
        当前为第{currentPage}页
      </div>
      <div>共{
        Math.ceil(totalNum / pageSize)
      }页</div>
    </footer>
  </div>
}
export default WordForm;