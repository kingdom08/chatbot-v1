import React from "react";

const Profil = () => {
  return (
    <div className="p-20 flex flex-col ml-55 mt-5 w-full gap-10">
      <h1 className="font-bold text-3xl">Halo , Onxxx xxx </h1>
      <div>
        {/* Koatak PRofil */}
        <div className="bg-blue-50 w-150 h-100 p-6 rounded-lg">
          <h1 className="font-bold text-2xl text-blue-600">Ringkasan Akun</h1>

          <div className="mt-10 flex flex-col gap-5 font-medium text-[17px] px-8">
            <section className=" flex justify-between  border-b-2 pb-2 border-gray-300  ">
              <p>NIM</p>
              <p>19013029</p>
            </section>
            <section className=" flex justify-between  border-b-2 pb-2 border-gray-300  ">
              <p>Nama</p>
              <p>Onxx Xxxx</p>
            </section>
            <section className=" flex justify-between  border-b-2 pb-2 border-gray-300  ">
              <p>Email</p>
              <p>19013029@unikadelasalle.ac.id</p>
            </section>
            <section className=" flex justify-between  border-b-2 pb-2 border-gray-300  ">
              <p>No Wa</p>
              <p>08522xxxx</p>
            </section>
            <section className=" flex justify-between  pb-2 border-gray-300  ">
              <p>Status Akun</p>
              <p className=" p-1 rounded-full' w-30 text-center bg-green-200">Aktif</p>
            </section>
          </div>
        </div>

        {/* kotak history */}
        <div></div>
      </div>
    </div>
  );
};

export default Profil;
