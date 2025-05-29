import React from 'react'
import MyTeamTemplate from './MyTeamTemplate'

const MyTeam = ({ team, matrixChildren }) => {
    
    return (
        <div className="w-[100%]  ">
            <div className="bg-blue-100 flex  border-amber-500  border-2  min-w-[100%]  text-black p-4 rounded-md shadow    items-center  justify-evenly  text-center mb-4">
                <div className="font-semibold text-lg">{team.name}</div>
                {/* <div className="text-sm text-gray-600">{team.email}</div> */}
                <div className="text-sm text-gray-600">
                    ID: {team.referralCode}
                </div>
                    <div className="">Level: {team.currentLevel}</div>
            </div>


            <div className=" justify-center   gap-4">
                {team.matrixChildren?.length > 0 ? (
                    team.matrixChildren.map((child, index) => (
                        <MyTeamTemplate key={child._id || index} childs={child} />
                    ))
                ) : (
                    <div className="text-gray-500 text-center py-12">Loading team data...</div>
                )}
            </div>
            <div>

            </div>
        </div>
    )
}

export default MyTeam