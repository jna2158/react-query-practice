import { useQuery } from "react-query";
import axios from "axios";

const Todos = () => {
  const fetchTodoList = () => {
    return axios.get('https://');
  }

  /**
   * @param status: axios query 상태 ("idle" | "error" | "loading" | "success")
   * @param isFetching: 서버에 연결해서 데이터를 fetching 하고있는지 (내부적으로 fetching 중일떄도 true) (true | false)
   * @param data: query data
   * @param error: error message
   */
  const { status, isFetching, data: todoList, error} = useQuery("get-todos", fetchTodoList, {
    refetchOnWindowFocus: false,
    retry: 0, // error를 보여주기 전까지 더 호출하는 횟수 (default: 3)
    staleTime: 1000 * 20, // 이 기간 내에는 쿼리가 다시 마운트되어도 패칭이 발생하지 않고 기존의 값을 반환한다.
    cacheTime: 1000 * 60 * 5,
    enabled: false, // 원래는 최초 마운트 시 수행되는데, 여기 조건에 걸리면 fetching 안됨
    onSuccess: data => {
      console.log(data);
    },
    onError: e => {
      console.log(e.message);
    }
  });

  const { data: nextTodo, error: nextError, isFetching: nextIsFetching } = useQuery("get-next-todos", () => {
    return axios.get("http://todo")
  }, {
    enabled: !!todoList // true가 되면 "get-next-todos" 를 실행한다. (동기적으로 실행됨)
  });


  if (status === "loading") return <span>Loading...</span>;

  if (status === "error") return <span>Error: {error.message}</span>;

  return(
    <ul>  
      {todoList && todoList.map(todo => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  )
}

export default Todos;



/*
<useQuery>

  - queryKey: query 캐싱 관리
    - 최초 마운트 시 useEffect처럼 useQuery가 fetching 된다.
      - 
    - 사용자가 지정한 queryKey 이름으로 결과를 캐시로 저장한다.
    - 사용자가 다른 라우팅으로 갔다가 다시 useQuery가 있는 라우팅으로 오면 캐시에 있는 내용을 리턴한다.
    - 백그라운드에서 사용자 모르게 isFetching 한다.
      - 백그라운드로 API 호출을 해서 캐시에 있는 데이터를 지속적으로 최신화 시킨다.
      - 백그라운드에서 cacheTime이 지나면 isFetching 한다.
      - cacheTime은 기본적으로 5분
  
    - staleTime
      데이터가 fresh -> stale 상태로 변경되는데 걸리는 시간
      - fresh 상태일때는 쿼리 인스턴스가 새롭게 mount 되어도 네트워크 fetch가 일어나지 않는다.
      - 데이터가 한번 fetch 되고 나서 staleTime이 지나지 않았다면 unmount 후 mount 되어도 fetch가 일어나지 않는다.
      - staleTime을 지정하지 않고 사용한다면 react query의 캐싱 기능을 사용할 수 없다.
      - 자주 변경되는 데이터라면 지정하지 않는 편이 좋지만, 정적인 데이터 또는 자주 변경될 필요가 없는 
        데이터라면 staleTime을 지정해서 서버의 부담을 줄여주는 것이 좋다. 
      - default 0

    - cacheTime
      - 데이터가 inactive 상태일 때 캐싱된 상태로 남아있는 시간
      - 쿼리 인스턴스가 unmount 되면 데이터는 inactive 상태로 변경되며, 캐시는 cacheTime만큼 유지된다.
      - cacheTime이 지나면 가비지 콜렉터로 수집된다.
      - cacheTime이 지나기 전에 쿼리 인스턴스가 다시 마운트 되면, 데이터를 fetch하는 동안 캐시 데이터를 보여준다.
      - cacheTime은 staleTime과 관계없이, 무조건 inactive 된 시점을 기준으로 캐시 데이터 삭제를 결정한다.
      - default 5min (300000)
      - cache가 존재한다고 해서 data refatching이 일어나지 않는것은 아님. cache가 존재하더라도 query 객체가 stale 상태라면 refatching을 수행한다.

        
  - queryFn: promise 처리가 이루어지는 함수
*/



/*
1. A 쿼리 인스턴스가 mount 됨
2. 네트워크에서 데이터 fetch 하고 A라는 query key로 캐싱함
3. 이 데이터는 fresh 상태에서 staleTime(기본값 0) 이후 stale 상태로 변경됨
4. A 쿼리 인스턴스가 unmount 됨
5. 캐시는 cacheTime(기본값 5min) 만큼 유지되다가 가비지 콜렉터로 수집됨
6. 만일 cacheTime이 지나기 전에 A 쿼리 인스턴스가 새롭게 mount되면, fetch가 실행되고
   fresh한 값을 가져오는 동안 캐시 데이터를 보여줌





*/



/*
- cacheTime (5분)이 지나면 백그라운드에서 isFetching 한다.
예를들어 staleTime을 10,000으로 설정하였다면, data fetching이 성공한 후 10초(= 10,000ms) 동안 fresh 상태로 존재하다가 10초 이후에는 stale 상태가 됩니다. stale 상태가 된 후 특정 조건이 충족되면 refetching이 일어나게됩니다. 주의할 점은 stale 상태가 되었다고 해서 refetching이 곧바로 일어나는 것이 아니라,
stale 상태가 되고 특정조건을 만족해야 refetching이 일어난다는 것입니다.


*/


/*

isLoading
캐싱된 데이터조차 없이 처음 실행된 쿼리일 때 true이다.
캐싱된 데이터가 있을 경우 fetch를 하더라도 cacheTime 동안에는 항상 false이다.
어떤 데이터를 처음 가져올 때 사용
isFetching
캐싱 여부와 상관없이 비동기 함수가 처리되었으면 true이다.
어떤 데이터를 다시 가져와야 할 때 사용

*/