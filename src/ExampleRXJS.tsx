import {createContext, PropsWithChildren, useContext, useEffect, useMemo, useState} from "react";
import {BehaviorSubject, combineLatest, distinctUntilChanged, map, Observable, shareReplay, tap} from "rxjs";

interface Dog {
    name: string;
    age: number;
    breed: string;
}

export const ExampleContext = createContext<{
    data$: Observable<Dog>
    data: Dog;
}>(null!);

export const ExampleProvider = ({children}: PropsWithChildren) => {

    const dataSubject = useMemo(() => {
        return new BehaviorSubject<Dog>({ name: 'Alfe', age: 10, breed: 'poodle' });
    }, []);

    useEffect(() => {
        let i = 1;
        const interval = setInterval(() => {
            console.log('QUERY API');
            const currentDog = dataSubject.value;
            dataSubject.next({ ...currentDog, name: currentDog.name + 's' });
            dataSubject.next(dataSubject.value);
            dataSubject.next(dataSubject.value);
            dataSubject.next(dataSubject.value);
            dataSubject.next(dataSubject.value);
        }, 2000);
        return () => clearInterval(interval)
    })

    return <ExampleContext.Provider value={{
        data$: dataSubject.asObservable(),
        get data() {
            return dataSubject.value;
        }
    }}>
        {children}
    </ExampleContext.Provider>

}


export const useDogAge = () => {
    const { data$ } = useContext(ExampleContext);
    const [age, setAge] = useState<number | null>(null);

    const age$ = data$.pipe(
        map(dog => dog.age),
    );


    combineLatest([age$, age$, age$, age$]).pipe()

    useEffect(() => {
        const subscription = data$.pipe(
            tap((dog) => console.log('dog', dog)),
            map(dog => dog.age),
            tap((age) => console.log('age', age)),
            distinctUntilChanged(), // ignoring unchanged values. Only send through values that are different from the last
        ).subscribe((newAge) => {
            console.log('setting');
            setAge(newAge);
        })

        return () => subscription.unsubscribe();
    }, [data$]);

    return age;
}
